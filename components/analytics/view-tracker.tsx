"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const SESSION_KEY = "pv_session"
const REF_KEY = "pv_ref"
const SENT_KEY = "pv_sent"

/** One id per browser tab session, so repeat scrolls are not counted twice. */
function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    // Private mode or storage disabled - fall back to a per-load id.
    return crypto.randomUUID()
  }
}

/**
 * Fires a single tracking beacon per path per session.
 *
 * Also picks up `?ref=<code>` from a tracked link, remembers it for the rest of
 * the session, and cleans it out of the address bar so the URL a visitor might
 * copy or share carries no tracking code.
 */
export function ViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Your own dashboard is not part of the portfolio - never count it.
    if (pathname.startsWith("/insights")) return

    const params = new URLSearchParams(window.location.search)
    const ref = params.get("ref")
    const ownerKey = params.get("owner")

    if (ref) {
      try {
        sessionStorage.setItem(REF_KEY, ref)
      } catch {
        /* ignore */
      }
    }

    if (ref || ownerKey) {
      params.delete("ref")
      params.delete("owner")
      const query = params.toString()
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
      )
    }

    let storedRef: string | null = null
    try {
      storedRef = sessionStorage.getItem(REF_KEY)
      const sent = JSON.parse(sessionStorage.getItem(SENT_KEY) ?? "[]") as string[]
      if (sent.includes(pathname)) return
      sessionStorage.setItem(SENT_KEY, JSON.stringify([...sent, pathname]))
    } catch {
      /* ignore and track anyway */
    }

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        ref: ref ?? storedRef,
        ownerKey,
        referrer: document.referrer || null,
        sessionId: getSessionId(),
      }),
      keepalive: true,
    })
      .then(() => window.dispatchEvent(new Event("portfolio:view-tracked")))
      .catch(() => {
        /* analytics must never break the page */
      })
  }, [pathname])

  return null
}
