import "server-only";
import { defaultConfig, defaultProfiles } from "@/lib/defaults";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { LimitStatus, Profile, PublicConfig } from "@/types";

const memoryLimits = new Map<string, { messages_sent: number; bonus_messages: number; last_reset: Date }>();

function toBool(value: unknown) {
  return value === true || value === "true";
}

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getProfiles(includeInactive = false): Promise<Profile[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return defaultProfiles.filter((profile) => includeInactive || profile.active !== false);

  const query = supabase.from("profiles").select("*").order("sort_order");
  const { data, error } = includeInactive ? await query : await query.eq("active", true);
  if (error || !data?.length) return defaultProfiles.filter((profile) => includeInactive || profile.active !== false);
  return data as unknown as Profile[];
}

export async function getProfile(id: string) {
  const profiles = await getProfiles(true);
  return profiles.find((profile) => profile.id === id) ?? null;
}

export async function getPublicConfig(): Promise<PublicConfig> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return defaultConfig;

  const [{ data: rows }, { data: adRows }] = await Promise.all([
    supabase.from("app_config").select("key,value"),
    supabase.from("ad_config").select("slot_name,enabled,ad_code,redirect_url")
  ]);

  if (!rows) return defaultConfig;
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  const ads = { ...defaultConfig.ads };
  for (const row of adRows ?? []) {
    ads[row.slot_name] = { enabled: row.enabled, code: row.ad_code ?? "", redirect_url: row.redirect_url ?? undefined };
  }

  return {
    ...defaultConfig,
    notification_enabled: toBool(map.notification_enabled),
    notification_text: String(map.notification_text ?? defaultConfig.notification_text),
    chat_free_limit: toNumber(map.chat_free_limit, defaultConfig.chat_free_limit),
    chat_bonus_amount: toNumber(map.chat_bonus_amount, defaultConfig.chat_bonus_amount),
    chat_claim_wait_seconds: toNumber(map.chat_claim_wait_seconds, defaultConfig.chat_claim_wait_seconds),
    chat_reset_hours: toNumber(map.chat_reset_hours, defaultConfig.chat_reset_hours),
    messages_per_ad: toNumber(map.messages_per_ad, defaultConfig.messages_per_ad),
    video_call_redirect: String(map.video_call_redirect ?? defaultConfig.video_call_redirect),
    voice_call_redirect: String(map.voice_call_redirect ?? defaultConfig.voice_call_redirect),
    claim_redirect_url: String(map.claim_redirect_url ?? defaultConfig.claim_redirect_url),
    site_name: String(map.site_name ?? defaultConfig.site_name),
    site_tagline: String(map.site_tagline ?? defaultConfig.site_tagline),
    ga4_enabled: toBool(map.ga4_enabled),
    ga4_measurement_id: String(map.ga4_measurement_id ?? ""),
    ai_provider: String(map.ai_provider ?? defaultConfig.ai_provider),
    ai_base_url: String(map.ai_base_url ?? defaultConfig.ai_base_url),
    ai_model: String(map.ai_model ?? defaultConfig.ai_model),
    ads
  };
}

export async function getLimit(fingerprint: string): Promise<LimitStatus> {
  const config = await getPublicConfig();
  const supabase = getSupabaseAdmin();
  const now = new Date();
  const resetMs = config.chat_reset_hours * 60 * 60 * 1000;

  if (supabase) {
    const { data } = await supabase.from("user_limits").select("messages_sent,bonus_messages,last_reset").eq("fingerprint", fingerprint).maybeSingle();
    let row = data;
    if (!row || now.getTime() - new Date(row.last_reset).getTime() > resetMs) {
      const next = { fingerprint, messages_sent: 0, bonus_messages: 0, last_reset: now.toISOString() };
      const result = await supabase.from("user_limits").upsert(next, { onConflict: "fingerprint" }).select("messages_sent,bonus_messages,last_reset").single();
      row = result.data;
    }
    const messagesSent = row?.messages_sent ?? 0;
    const bonus = row?.bonus_messages ?? 0;
    const total = config.chat_free_limit + bonus;
    return { messages_sent: messagesSent, free_limit: config.chat_free_limit, bonus_messages: bonus, total_allowed: total, remaining: Math.max(0, total - messagesSent), reset_at: new Date(new Date(row?.last_reset ?? now).getTime() + resetMs).toISOString() };
  }

  const current = memoryLimits.get(fingerprint);
  const row = !current || now.getTime() - current.last_reset.getTime() > resetMs ? { messages_sent: 0, bonus_messages: 0, last_reset: now } : current;
  memoryLimits.set(fingerprint, row);
  const total = config.chat_free_limit + row.bonus_messages;
  return { messages_sent: row.messages_sent, free_limit: config.chat_free_limit, bonus_messages: row.bonus_messages, total_allowed: total, remaining: Math.max(0, total - row.messages_sent), reset_at: new Date(row.last_reset.getTime() + resetMs).toISOString() };
}

export async function incrementLimit(fingerprint: string) {
  const supabase = getSupabaseAdmin();
  const current = await getLimit(fingerprint);
  if (current.remaining <= 0) return current;
  if (supabase) await supabase.from("user_limits").update({ messages_sent: current.messages_sent + 1 }).eq("fingerprint", fingerprint);
  else memoryLimits.set(fingerprint, { messages_sent: current.messages_sent + 1, bonus_messages: current.bonus_messages, last_reset: new Date(Date.now() - (new Date(current.reset_at).getTime() - Date.now()) + (await getPublicConfig()).chat_reset_hours * 60 * 60 * 1000) });
  return getLimit(fingerprint);
}

export async function claimLimit(fingerprint: string) {
  const config = await getPublicConfig();
  const current = await getLimit(fingerprint);
  const supabase = getSupabaseAdmin();
  if (current.bonus_messages > 0) return current;
  if (supabase) await supabase.from("user_limits").update({ bonus_messages: current.bonus_messages + config.chat_bonus_amount }).eq("fingerprint", fingerprint);
  else memoryLimits.set(fingerprint, { messages_sent: current.messages_sent, bonus_messages: current.bonus_messages + config.chat_bonus_amount, last_reset: new Date(Date.now() - (new Date(current.reset_at).getTime() - Date.now()) + config.chat_reset_hours * 60 * 60 * 1000) });
  return getLimit(fingerprint);
}
