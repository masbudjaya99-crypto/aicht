import { NextRequest, NextResponse } from "next/server";
import { generateReply } from "@/lib/ai";
import { getLimit, getProfile, getPublicConfig, incrementLimit } from "@/lib/data";
import type { ChatMessage } from "@/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const fingerprint = body.fingerprint || "anonymous";
  const profile = await getProfile(body.profile_id);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const beforeLimit = await getLimit(fingerprint);
  if (beforeLimit.remaining <= 0) return NextResponse.json({ error: "Limit exceeded", limit: beforeLimit }, { status: 429 });
  const limit = await incrementLimit(fingerprint);

  const config = await getPublicConfig();
  const reply = await generateReply(profile, body.message, (body.history ?? []) as ChatMessage[], config);
  return NextResponse.json({ reply, session_id: body.session_id || crypto.randomUUID(), limit });
}
