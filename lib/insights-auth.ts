import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

/**
 * Minimal session auth for the private /insights dashboard.
 *
 * One password (INSIGHTS_PASSWORD) exchanges for a signed, expiring cookie.
 * The cookie carries no secret of its own - it is `expiry.hmac(expiry)`, so it
 * cannot be forged without INSIGHTS_SECRET and cannot be replayed forever.
 */

export const SESSION_COOKIE = "insights_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

function getSecret(): string {
  return process.env.INSIGHTS_SECRET ?? process.env.INSIGHTS_PASSWORD ?? "insecure-dev-secret"
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex")
}

/** Compares two strings in constant time, via fixed-length digests. */
function safeEqual(a: string, b: string): boolean {
  const da = createHash("sha256").update(a).digest()
  const db = createHash("sha256").update(b).digest()
  return timingSafeEqual(da, db)
}

export function isPasswordConfigured(): boolean {
  return Boolean(process.env.INSIGHTS_PASSWORD)
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.INSIGHTS_PASSWORD
  if (!expected) return false
  return safeEqual(candidate, expected)
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + SESSION_TTL_MS)
  return `${expiresAt}.${sign(expiresAt)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const [expiresAt, signature] = token.split(".")
  if (!expiresAt || !signature) return false
  if (!safeEqual(sign(expiresAt), signature)) return false
  const expiry = Number(expiresAt)
  return Number.isFinite(expiry) && expiry > Date.now()
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
}

/** Server-side guard usable from both route handlers and server components. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}
