import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getPublicConfig } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await getPublicConfig();
  return NextResponse.json({ ai_provider: config.ai_provider, ai_base_url: config.ai_base_url, ai_model: config.ai_model, ai_api_key: "hidden" });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/ai", request.url));
  const keys = ["ai_provider", "ai_base_url", "ai_model", "ai_api_key"];
  const rows = keys.map((key) => ({ key, value: String(form.get(key) ?? "") })).filter((row) => row.key !== "ai_api_key" || row.value);
  await supabase.from("app_config").upsert(rows, { onConflict: "key" });
  return NextResponse.redirect(new URL("/admin/ai", request.url));
}
