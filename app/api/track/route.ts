import { NextResponse } from "next/server"
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db"
import {
  clamp,
  getClientIp,
  getGeo,
  hashVisitor,
  normalizeReferrer,
  parseUserAgent,
} from "@/lib/visitor"
import { OWNER_COOKIE, ownerCookieOptions } from "@/lib/owner"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Records a single page view. Called once per path per browser session by
 * <ViewTracker />. Returns the public totals so the on-page counter can update
 * without a second round trip.
 */
export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, reason: "db-not-configured" }, { status: 200 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-json" }, { status: 400 })
  }

  const headers = request.headers
  const userAgent = headers.get("user-agent") ?? ""
  const { device, browser, os } = parseUserAgent(userAgent)

  // Ignore crawlers so the numbers reflect actual people.
  if (browser === "Bot") {
    return NextResponse.json({ ok: true, skipped: "bot" })
  }

  const sessionId = clamp(body.sessionId, 64)
  if (!sessionId) {
    return NextResponse.json({ ok: false, reason: "missing-session" }, { status: 400 })
  }

  const ip = getClientIp(headers)
  const visitorHash = hashVisitor(ip, userAgent)
  const geo = getGeo(headers)

  let selfHost: string | null = null
  try {
    selfHost = new URL(request.url).hostname
  } catch {
    selfHost = null
  }

  // Two ways to be flagged as the owner: an existing cookie, or arriving with
  // ?owner=<OWNER_KEY>. Owner views are stored but excluded from every count,
  // so previewing your own site does not inflate the public number.
  const ownerKey = process.env.OWNER_KEY
  const claimsOwner = clamp(body.ownerKey, 128)
  const becomesOwner = Boolean(ownerKey && claimsOwner && claimsOwner === ownerKey)
  // Match on a cookie boundary so an unrelated cookie ending in the same
  // characters cannot mark a stranger as the owner.
  const alreadyOwner = new RegExp(`(?:^|;\\s*)${OWNER_COOKIE}=1(?:;|$)`).test(
    request.headers.get("cookie") ?? ""
  )
  const isOwner = becomesOwner || alreadyOwner

  try {
    await ensureSchema()
    const sql = getSql()

    // Rate limit: a single session cannot write more than 30 rows per hour.
    const [{ recent }] = (await sql`
      select count(*)::int as recent
      from page_views
      where session_id = ${sessionId}
        and created_at > now() - interval '1 hour'
    `) as { recent: number }[]

    if (recent >= 30) {
      return NextResponse.json({ ok: true, skipped: "rate-limited" })
    }

    await sql`
      insert into page_views
        (path, ref_code, referrer, country, city, region, device, browser, os, visitor_hash, session_id, is_owner)
      values (
        ${clamp(body.path, 512) ?? "/"},
        ${clamp(body.ref, 64)},
        ${normalizeReferrer(clamp(body.referrer, 1024), selfHost)},
        ${geo.country},
        ${geo.city},
        ${geo.region},
        ${device},
        ${browser},
        ${os},
        ${visitorHash},
        ${sessionId},
        ${isOwner}
      )
    `

    const [totals] = (await sql`
      select
        count(*)::int                        as views,
        count(distinct visitor_hash)::int    as visitors
      from page_views
      where is_owner = false
    `) as { views: number; visitors: number }[]

    const response = NextResponse.json({ ok: true, ...totals })
    if (becomesOwner) {
      response.cookies.set(OWNER_COOKIE, "1", ownerCookieOptions)
    }
    return response
  } catch (error) {
    console.error("[track] failed to record view:", error)
    return NextResponse.json({ ok: false, reason: "db-error" }, { status: 500 })
  }
}
