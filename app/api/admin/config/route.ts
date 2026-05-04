import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getPublicConfig } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getPublicConfig());
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/config", request.url));
  const rows = Array.from(form.entries()).map(([key, value]) => ({ key, value: String(value) }));
  if (rows.length) await supabase.from("app_config").upsert(rows, { onConflict: "key" });
  return NextResponse.redirect(new URL("/admin/config", request.url));
}
