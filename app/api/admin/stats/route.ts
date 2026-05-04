import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getProfiles, getPublicConfig } from "@/lib/data";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [profiles, config] = await Promise.all([getProfiles(true), getPublicConfig()]);
  return NextResponse.json({ active_profiles: profiles.filter((profile) => profile.active !== false).length, chat_sessions_today: null, messages_today: null, ai_provider: config.ai_provider });
}
