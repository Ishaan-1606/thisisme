import { NextResponse } from "next/server"
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db"
import { isAuthenticated } from "@/lib/insights-auth"
import { clamp } from "@/lib/visitor"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Registers a named tracked link, e.g. code "google-recruiter". */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  const rawCode = clamp(body.code, 64)
  const label = clamp(body.label, 120)
  if (!rawCode || !label) {
    return NextResponse.json({ ok: false, error: "Code and label are required." }, { status: 400 })
  }

  // Keep codes URL-safe so they survive being pasted into an email or a DM.
  const code = rawCode.toLowerCase().replace(/[^a-z0-9-_]/g, "-").replace(/-+/g, "-")
  if (!code) {
    return NextResponse.json({ ok: false, error: "That code has no usable characters." }, { status: 400 })
  }

  try {
    await ensureSchema()
    const sql = getSql()
    await sql`
      insert into tracked_links (code, label, note)
      values (${code}, ${label}, ${clamp(body.note, 200)})
      on conflict (code) do update set label = excluded.label, note = excluded.note
    `
    return NextResponse.json({ ok: true, code })
  } catch (error) {
    console.error("[insights/links] write failed:", error)
    return NextResponse.json({ ok: false, error: "Could not save that link." }, { status: 500 })
  }
}

/** Removes the label for a code. Existing page views are left untouched. */
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const code = clamp(new URL(request.url).searchParams.get("code"), 64)
  if (!code) {
    return NextResponse.json({ ok: false, error: "Missing code." }, { status: 400 })
  }

  try {
    await ensureSchema()
    const sql = getSql()
    await sql`delete from tracked_links where code = ${code}`
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[insights/links] delete failed:", error)
    return NextResponse.json({ ok: false, error: "Could not delete that link." }, { status: 500 })
  }
}
