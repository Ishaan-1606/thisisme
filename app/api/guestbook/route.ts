import { NextResponse } from "next/server"
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db"
import { clamp, getClientIp, getGeo, hashVisitor, parseUserAgent } from "@/lib/visitor"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_NAME = 60
const MAX_ROLE = 80
const MAX_COMPANY = 80
const MAX_MESSAGE = 400
const MAX_LINK = 300

/** Public wall - returns only the fields a visitor consented to publish. */
export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ ok: true, entries: [] })

  try {
    await ensureSchema()
    const sql = getSql()

    const entries = await sql`
      select id, name, role, company, message, link, country, created_at
      from guestbook_entries
      where approved = true
      order by created_at desc
      limit 50
    `

    return NextResponse.json({ ok: true, entries })
  } catch (error) {
    console.error("[guestbook] read failed:", error)
    return NextResponse.json({ ok: true, entries: [] })
  }
}

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "The guestbook is not connected yet." },
      { status: 503 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  // Honeypot: a real person never fills a field that is hidden from them.
  if (clamp(body.website, 200)) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const name = clamp(body.name, MAX_NAME)
  const message = clamp(body.message, MAX_MESSAGE)
  if (!name || !message) {
    return NextResponse.json(
      { ok: false, error: "Name and message are both required." },
      { status: 400 }
    )
  }
  if (message.length < 3) {
    return NextResponse.json({ ok: false, error: "That message is a bit too short." }, { status: 400 })
  }

  // Only accept a real http(s) profile URL, so the wall cannot host javascript:
  // or data: links.
  let link: string | null = null
  const rawLink = clamp(body.link, MAX_LINK)
  if (rawLink) {
    try {
      const parsed = new URL(rawLink)
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return NextResponse.json({ ok: false, error: "Links must start with http(s)." }, { status: 400 })
      }
      link = parsed.toString()
    } catch {
      return NextResponse.json({ ok: false, error: "That link does not look valid." }, { status: 400 })
    }
  }

  const headers = request.headers
  const userAgent = headers.get("user-agent") ?? ""
  if (parseUserAgent(userAgent).browser === "Bot") {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const visitorHash = hashVisitor(getClientIp(headers), userAgent)
  const geo = getGeo(headers)

  try {
    await ensureSchema()
    const sql = getSql()

    // One signature per visitor per 10 minutes, three per day.
    const [limits] = (await sql`
      select
        (count(*) filter (where created_at > now() - interval '10 minutes'))::int as recent,
        (count(*) filter (where created_at > now() - interval '1 day'))::int      as today
      from guestbook_entries
      where visitor_hash = ${visitorHash}
    `) as { recent: number; today: number }[]

    if (limits.recent > 0) {
      return NextResponse.json(
        { ok: false, error: "You just signed - give it a few minutes before posting again." },
        { status: 429 }
      )
    }
    if (limits.today >= 3) {
      return NextResponse.json(
        { ok: false, error: "That is enough signatures for one day. Thank you!" },
        { status: 429 }
      )
    }

    const [entry] = await sql`
      insert into guestbook_entries (name, role, company, message, link, country, visitor_hash)
      values (
        ${name},
        ${clamp(body.role, MAX_ROLE)},
        ${clamp(body.company, MAX_COMPANY)},
        ${message},
        ${link},
        ${geo.country},
        ${visitorHash}
      )
      returning id, name, role, company, message, link, country, created_at
    `

    return NextResponse.json({ ok: true, entry })
  } catch (error) {
    console.error("[guestbook] write failed:", error)
    return NextResponse.json({ ok: false, error: "Could not save that right now." }, { status: 500 })
  }
}
