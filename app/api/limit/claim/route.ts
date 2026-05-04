import { NextRequest, NextResponse } from "next/server";
import { claimLimit } from "@/lib/data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(await claimLimit(body.fingerprint || "anonymous"));
}
