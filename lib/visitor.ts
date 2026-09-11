import { createHash } from "node:crypto"

/**
 * Server-side visitor fingerprinting helpers.
 *
 * Privacy stance: a raw IP address is never written to the database. It is
 * salted and hashed into an opaque id that lets us count unique people without
 * being able to identify or re-target them. Change VISITOR_SALT and every
 * historical hash becomes unlinkable.
 */

type HeaderBag = Headers

export function getClientIp(headers: HeaderBag): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    // Left-most entry is the original client; the rest are proxies.
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown"
}

export function hashVisitor(ip: string, userAgent: string): string {
  const salt = process.env.VISITOR_SALT ?? "portfolio-default-salt"
  return createHash("sha256").update(`${salt}|${ip}|${userAgent}`).digest("hex").slice(0, 32)
}

export type Geo = {
  country: string | null
  city: string | null
  region: string | null
}

/**
 * Geo comes free from the edge on Vercel and Cloudflare. On a plain Node host
 * (Render, a VPS) these headers are absent and we simply store nulls rather
 * than calling out to a third-party lookup service.
 */
export function getGeo(headers: HeaderBag): Geo {
  const decode = (value: string | null): string | null => {
    if (!value) return null
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }

  return {
    country: headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry") ?? null,
    city: decode(headers.get("x-vercel-ip-city")),
    region: decode(headers.get("x-vercel-ip-country-region")),
  }
}

export type UserAgentInfo = {
  device: string
  browser: string
  os: string
}

/**
 * Deliberately tiny UA parser. A full library would add a dependency and a
 * megabyte of regexes for detail this dashboard never shows.
 */
export function parseUserAgent(ua: string): UserAgentInfo {
  const s = ua.toLowerCase()

  const isTablet = /ipad|tablet|playbook|silk/.test(s) || (/android/.test(s) && !/mobile/.test(s))
  const isMobile = /mobi|iphone|ipod|android.*mobile|windows phone/.test(s)
  const device = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop"

  let os = "Unknown"
  if (/windows nt/.test(s)) os = "Windows"
  else if (/iphone|ipad|ipod/.test(s)) os = "iOS"
  else if (/mac os x/.test(s)) os = "macOS"
  else if (/android/.test(s)) os = "Android"
  else if (/linux/.test(s)) os = "Linux"

  // Order matters: Edge and Opera both advertise Chrome, Chrome advertises Safari.
  let browser = "Unknown"
  if (/edg\//.test(s)) browser = "Edge"
  else if (/opr\/|opera/.test(s)) browser = "Opera"
  else if (/firefox\//.test(s)) browser = "Firefox"
  else if (/chrome\/|crios/.test(s)) browser = "Chrome"
  else if (/safari\//.test(s)) browser = "Safari"
  else if (/bot|crawler|spider|slurp/.test(s)) browser = "Bot"

  return { device, browser, os }
}

/** Turns a raw referrer URL into a readable source label. */
export function normalizeReferrer(referrer: string | null, selfHost: string | null): string | null {
  if (!referrer) return null
  try {
    const url = new URL(referrer)
    if (selfHost && url.hostname === selfHost) return null // internal navigation
    return url.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

/** Rejects absurd values before they reach the database. */
export function clamp(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, max)
}
