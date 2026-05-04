import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getPublicConfig } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json((await getPublicConfig()).ads);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/ads", request.url));
  const slots = new Set(Array.from(form.keys()).map((key) => key.split(":")[0]));
  const rows = Array.from(slots).map((slot) => ({ slot_name: slot, enabled: form.get(`${slot}:enabled`) === "on", ad_code: String(form.get(`${slot}:code`) ?? "") }));
  if (rows.length) await supabase.from("ad_config").upsert(rows, { onConflict: "slot_name" });
  return NextResponse.redirect(new URL("/admin/ads", request.url));
}
