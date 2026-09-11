import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  isPasswordConfigured,
  sessionCookieOptions,
} from "@/lib/insights-auth"
import { clamp } from "@/lib/visitor"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!isPasswordConfigured()) {
    return NextResponse.json(
      { ok: false, error: "INSIGHTS_PASSWORD is not set on the server." },
      { status: 503 }
    )
  }

  let password: string | null = null
  try {
    const body = await request.json()
    password = clamp(body.password, 200)
  } catch {
    /* falls through to the invalid-password branch */
  }

  if (!password || !checkPassword(password)) {
    // Deliberately slow down brute force a little without blocking the server.
    await new Promise((resolve) => setTimeout(resolve, 600))
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions)
  return response
}

/** Logout. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 })
  return response
}
