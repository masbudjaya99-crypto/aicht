import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getProfiles } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getProfiles(true));
}

function asNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function profilePayload(form: FormData) {
  return {
    name: String(form.get("name") ?? "").trim(),
    age: asNumber(form.get("age"), 25),
    photo_url: String(form.get("photo_url") ?? "").trim(),
    tags: asTags(form.get("tags")),
    bio: String(form.get("bio") ?? "").trim(),
    status: String(form.get("status") ?? "online"),
    verified: form.get("verified") === "on",
    rating: asNumber(form.get("rating"), 4.8),
    ai_prompt: String(form.get("ai_prompt") ?? "").trim(),
    active: form.get("active") === "on",
    sort_order: asNumber(form.get("sort_order"), 0)
  };
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/profiles?error=supabase", request.url));

  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const id = String(form.get("id") ?? "");

  if (action === "delete" && id) {
    const { data: sessions } = await supabase.from("chat_sessions").select("id").eq("profile_id", id);
    const sessionIds = (sessions ?? []).map((session) => session.id);
    if (sessionIds.length) await supabase.from("chat_messages").delete().in("session_id", sessionIds);
    await supabase.from("chat_sessions").delete().eq("profile_id", id);
    await supabase.from("profiles").delete().eq("id", id);
  }

  if (action === "toggle" && id) {
    await supabase.from("profiles").update({ active: form.get("active") !== "true" }).eq("id", id);
  }

  if (action === "create") {
    const payload = profilePayload(form);
    if (payload.name && payload.photo_url && payload.ai_prompt) await supabase.from("profiles").insert(payload);
  }

  if (action === "update" && id) {
    const payload = profilePayload(form);
    if (payload.name && payload.photo_url && payload.ai_prompt) await supabase.from("profiles").update(payload).eq("id", id);
  }

  revalidatePath("/");
  revalidatePath("/admin/profiles");
  return NextResponse.redirect(new URL("/admin/profiles", request.url));
}
