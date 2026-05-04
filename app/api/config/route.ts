import { NextResponse } from "next/server";
import { getPublicConfig } from "@/lib/data";

export async function GET() {
  const config = await getPublicConfig();
  return NextResponse.json(config);
}
