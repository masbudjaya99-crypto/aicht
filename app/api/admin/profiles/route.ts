import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getProfiles } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";

const photoBucket = "profile-photos";

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

function profilePayload(form: FormData, uploadedPhotoUrl?: string) {
  return {
    name: String(form.get("name") ?? "").trim(),
    age: asNumber(form.get("age"), 25),
    photo_url: uploadedPhotoUrl || String(form.get("photo_url") ?? "").trim(),
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

async function uploadProfilePhoto(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>, form: FormData) {
  const file = form.get("photo_file");
  if (!(file instanceof File) || file.size === 0) return undefined;
  if (!file.type.startsWith("image/")) return undefined;
  if (file.size > 5 * 1024 * 1024) return undefined;

  await supabase.storage.createBucket(photoBucket, {
    public: true,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    fileSizeLimit: 5 * 1024 * 1024
  });

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const filename = `${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(photoBucket).upload(filename, bytes, { contentType: file.type, upsert: false });
  if (error) return undefined;

  return supabase.storage.from(photoBucket).getPublicUrl(filename).data.publicUrl;
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
    const payload = profilePayload(form, await uploadProfilePhoto(supabase, form));
    if (payload.name && payload.photo_url && payload.ai_prompt) await supabase.from("profiles").insert(payload);
  }

  if (action === "update" && id) {
    const payload = profilePayload(form, await uploadProfilePhoto(supabase, form));
    if (payload.name && payload.photo_url && payload.ai_prompt) await supabase.from("profiles").update(payload).eq("id", id);
  }

  revalidatePath("/");
  revalidatePath("/admin/profiles");
  return NextResponse.redirect(new URL("/admin/profiles", request.url));
}
