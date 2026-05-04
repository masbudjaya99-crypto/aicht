import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "node:crypto";

const cookieName = "admin_session";

function secret() {
  return new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "dev-secret-change-me");
}

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD_HASH || hashPassword("admin123");
  const actual = hashPassword(password);
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export async function createAdminToken(username: string) {
  return new SignJWT({ username }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("24h").sign(secret());
}

export async function isAdminRequest() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdminRequest())) redirect("/admin/login");
}

export const adminCookie = cookieName;
