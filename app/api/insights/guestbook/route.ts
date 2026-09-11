import { NextResponse } from "next/server"
import { ensureSchema, getSql, isDbConfigured } from "@/lib/db"
import { isAuthenticated } from "@/lib/insights-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Show or hide a guestbook entry on the public wall. */
export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 503 })
  }

  let id: number
  let approved: boolean
  try {
    const body = await request.json()
    id = Number(body.id)
    approved = Boolean(body.approved)
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id." }, { status: 400 })
  }

  try {
    await ensureSchema()
    const sql = getSql()
    await sql`update guestbook_entries set approved = ${approved} where id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[insights/guestbook] update failed:", error)
    return NextResponse.json({ ok: false, error: "Could not update that entry." }, { status: 500 })
  }
}

/** Permanently removes an entry - used for spam. */
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const id = Number(new URL(request.url).searchParams.get("id"))
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id." }, { status: 400 })
  }

  try {
    await ensureSchema()
    const sql = getSql()
    await sql`delete from guestbook_entries where id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[insights/guestbook] delete failed:", error)
    return NextResponse.json({ ok: false, error: "Could not delete that entry." }, { status: 500 })
  }
}
