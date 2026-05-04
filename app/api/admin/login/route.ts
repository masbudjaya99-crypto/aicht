import { NextRequest, NextResponse } from "next/server";
import { adminCookie, createAdminToken, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  if (username !== expectedUser || !verifyAdminPassword(password || "")) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie, await createAdminToken(username), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 });
  return response;
}
