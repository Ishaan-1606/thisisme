import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let client: NeonQueryFunction<false, false> | null = null

/**
 * Lazily created Neon HTTP client. The connection string never reaches the
 * browser - every caller of this lives in a route handler or server component.
 */
export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and paste your Neon connection string."
    )
  }
  if (!client) client = neon(url)
  return client
}

/** True when a Neon connection string is configured at all. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

let schemaReady: Promise<void> | null = null

/**
 * Creates the analytics tables if they are missing. Runs at most once per
 * serverless instance, so the cost after the first request is a resolved
 * promise. The Neon HTTP driver allows one statement per call, hence the
 * sequential awaits rather than a single script.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createSchema().catch((err) => {
      // Let the next request retry instead of caching a failed migration.
      schemaReady = null
      throw err
    })
  }
  return schemaReady
}

async function createSchema(): Promise<void> {
  const sql = getSql()

  await sql`
    create table if not exists page_views (
      id            bigserial primary key,
      path          text        not null default '/',
      ref_code      text,
      referrer      text,
      country       text,
      city          text,
      region        text,
      device        text,
      browser       text,
      os            text,
      visitor_hash  text        not null,
      session_id    text        not null,
      is_owner      boolean     not null default false,
      created_at    timestamptz not null default now()
    )
  `
  await sql`create index if not exists page_views_created_at_idx on page_views (created_at desc)`
  await sql`create index if not exists page_views_visitor_idx on page_views (visitor_hash)`
  await sql`create index if not exists page_views_ref_code_idx on page_views (ref_code)`

  await sql`
    create table if not exists guestbook_entries (
      id            bigserial primary key,
      name          text        not null,
      role          text,
      company       text,
      message       text        not null,
      link          text,
      country       text,
      visitor_hash  text,
      approved      boolean     not null default true,
      created_at    timestamptz not null default now()
    )
  `
  await sql`create index if not exists guestbook_created_at_idx on guestbook_entries (created_at desc)`

  await sql`
    create table if not exists tracked_links (
      code       text primary key,
      label      text        not null,
      note       text,
      created_at timestamptz not null default now()
    )
  `
}
