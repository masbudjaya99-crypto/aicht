import { NextResponse } from "next/server";
import { getProfiles } from "@/lib/data";

export async function GET() {
  const profiles = await getProfiles();
  return NextResponse.json(profiles.map(({ ai_prompt, ...profile }) => profile));
}
