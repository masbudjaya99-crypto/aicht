import { NextRequest, NextResponse } from "next/server";
import { getLimit } from "@/lib/data";

export async function GET(request: NextRequest) {
  const fingerprint = request.nextUrl.searchParams.get("fp") || "anonymous";
  return NextResponse.json(await getLimit(fingerprint));
}
