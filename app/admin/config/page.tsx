import { getPublicConfig } from "@/lib/data";
import { AdminFrame } from "@/components/AdminFrame";

const fields = ["notification_enabled", "notification_text", "chat_free_limit", "chat_bonus_amount", "chat_claim_wait_seconds", "chat_reset_hours", "messages_per_ad", "video_call_redirect", "voice_call_redirect", "claim_redirect_url", "site_name", "site_tagline"] as const;

export default async function AdminConfigPage() {
  const config = await getPublicConfig();
  return <AdminFrame><div><h1 className="font-display text-4xl font-black">App Configuration</h1><form className="glass mt-6 grid gap-4 rounded-[2rem] p-5">{fields.map((field) => <label key={field} className="grid gap-2 text-sm text-[var(--text2)]">{field}<input name={field} defaultValue={String(config[field])} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>)}<button formAction="/api/admin/config" formMethod="post" className="rounded-2xl gradient-bg px-4 py-3 font-bold text-white">Save to Supabase</button></form></div></AdminFrame>;
}
