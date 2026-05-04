import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getProfiles } from "@/lib/data";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getProfiles(true));
}
