import { NextResponse } from "next/server"
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Public, aggregate-only stats for the on-page counter.
 *
 * Everything here is safe to show the world: counts and a coarse "last visitor
 * came from <country>" signal. No IPs, no hashes, no per-person rows.
 */
export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, views: 0, visitors: 0, last24h: 0, countries: 0 })
  }

  try {
    await ensureSchema()
    const sql = getSql()

    const [row] = (await sql`
      select
        count(*)::int                                                             as views,
        count(distinct visitor_hash)::int                                         as visitors,
        (count(*) filter (where created_at > now() - interval '24 hours'))::int    as last24h,
        count(distinct country)::int                                              as countries
      from page_views
      where is_owner = false
    `) as { views: number; visitors: number; last24h: number; countries: number }[]

    const recent = (await sql`
      select country, city, created_at
      from page_views
      where is_owner = false and country is not null
      order by created_at desc
      limit 5
    `) as { country: string; city: string | null; created_at: string }[]

    return NextResponse.json(
      { ok: true, ...row, recent },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } }
    )
  } catch (error) {
    console.error("[stats] query failed:", error)
    return NextResponse.json({ ok: false, views: 0, visitors: 0, last24h: 0, countries: 0 })
  }
}
