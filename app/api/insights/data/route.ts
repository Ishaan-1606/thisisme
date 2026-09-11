import { NextResponse } from "next/server"
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db"
import { isAuthenticated } from "@/lib/insights-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Everything the private dashboard renders, in one round trip.
 *
 * Guarded by the session cookie - an unauthenticated caller gets a 401 and no
 * data whatsoever, because this is the one endpoint that exposes per-visit
 * detail rather than aggregates.
 */
export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 503 })
  }

  const url = new URL(request.url)
  const requested = Number(url.searchParams.get("days") ?? 30)
  const days = [7, 30, 90, 365].includes(requested) ? requested : 30

  try {
    await ensureSchema()
    const sql = getSql()

    const [totals] = (await sql`
      select
        count(*)::int                                                        as views,
        count(distinct visitor_hash)::int                                    as visitors,
        (count(*) filter (where created_at > now() - interval '24 hours'))::int as views24h,
        (count(*) filter (where created_at > now() - interval '7 days'))::int   as views7d,
        count(distinct country)::int                                         as countries,
        (count(distinct ref_code) filter (where ref_code is not null))::int    as "refCodes"
      from page_views
      where is_owner = false
    `) as Record<string, number>[]

    const daily = await sql`
      select
        to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
        count(*)::int                                        as views,
        count(distinct visitor_hash)::int                    as visitors
      from page_views
      where is_owner = false
        and created_at > now() - make_interval(days => ${days})
      group by 1
      order by 1
    `

    const referrers = await sql`
      select coalesce(referrer, 'Direct / unknown') as source, count(*)::int as views
      from page_views
      where is_owner = false
        and created_at > now() - make_interval(days => ${days})
      group by 1
      order by views desc
      limit 12
    `

    // Tracked links: left join so a code that was shared but never registered
    // still shows up, and a registered link with zero opens still appears.
    const links = await sql`
      select
        coalesce(l.code, v.ref_code)              as code,
        coalesce(l.label, v.ref_code)             as label,
        l.note                                    as note,
        coalesce(v.views, 0)                      as views,
        coalesce(v.visitors, 0)                   as visitors,
        v.last_seen                               as "lastSeen"
      from tracked_links l
      full outer join (
        select
          ref_code,
          count(*)::int                     as views,
          count(distinct visitor_hash)::int as visitors,
          max(created_at)                   as last_seen
        from page_views
        where is_owner = false and ref_code is not null
        group by ref_code
      ) v on v.ref_code = l.code
      order by 4 desc, 2 asc
      limit 50
    `

    const countries = await sql`
      select coalesce(country, 'Unknown') as country, count(*)::int as views
      from page_views
      where is_owner = false
        and created_at > now() - make_interval(days => ${days})
      group by 1
      order by views desc
      limit 12
    `

    const devices = await sql`
      select coalesce(device, 'Unknown') as name, count(*)::int as views
      from page_views
      where is_owner = false
        and created_at > now() - make_interval(days => ${days})
      group by 1
      order by views desc
    `

    const browsers = await sql`
      select coalesce(browser, 'Unknown') as name, count(*)::int as views
      from page_views
      where is_owner = false
        and created_at > now() - make_interval(days => ${days})
      group by 1
      order by views desc
      limit 8
    `

    // A short visitor id lets you recognise a returning person across visits
    // without ever storing or showing their IP address.
    const recent = await sql`
      select
        left(visitor_hash, 8) as visitor,
        path,
        ref_code              as "refCode",
        referrer,
        country,
        city,
        device,
        browser,
        os,
        created_at            as "createdAt"
      from page_views
      where is_owner = false
      order by created_at desc
      limit 60
    `

    const returning = await sql`
      select left(visitor_hash, 8) as visitor,
             count(*)::int          as views,
             max(created_at)        as "lastSeen",
             min(created_at)        as "firstSeen",
             max(country)           as country
      from page_views
      where is_owner = false
      group by visitor_hash
      having count(*) > 1
      order by count(*) desc
      limit 15
    `

    const guestbook = await sql`
      select id, name, role, company, message, link, country, approved, created_at as "createdAt"
      from guestbook_entries
      order by created_at desc
      limit 100
    `

    return NextResponse.json({
      ok: true,
      days,
      totals,
      daily,
      referrers,
      links,
      countries,
      devices,
      browsers,
      recent,
      returning,
      guestbook,
    })
  } catch (error) {
    console.error("[insights] query failed:", error)
    return NextResponse.json({ ok: false, error: "Query failed." }, { status: 500 })
  }
}
