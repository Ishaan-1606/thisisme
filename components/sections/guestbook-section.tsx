"use client"

import { useEffect, useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PenLine, ExternalLink, Loader2, Check } from "lucide-react"

type Entry = {
  id: number
  name: string
  role: string | null
  company: string | null
  message: string
  link: string | null
  country: string | null
  created_at: string
}

const initialForm = { name: "", role: "", company: "", message: "", link: "", website: "" }

function timeAgo(iso: string): string {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  const units: [number, string][] = [
    [60, "s"],
    [3600, "m"],
    [86400, "h"],
    [2592000, "d"],
  ]
  if (seconds < 60) return `${seconds}s ago`
  for (let i = 1; i < units.length; i++) {
    if (seconds < units[i][0]) return `${Math.floor(seconds / units[i - 1][0])}${units[i][1]} ago`
  }
  return new Date(iso).toLocaleDateString()
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function GuestbookSection() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch("/api/guestbook")
      .then((res) => res.json())
      .then((data) => setEntries(data?.entries ?? []))
      .catch(() => setEntries([]))
  }, [])

  const update = (field: keyof typeof initialForm) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus("sending")
    setError(null)

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong.")
        setStatus("idle")
        return
      }

      // Signatures are reviewed before they appear, so there is nothing to add
      // to the wall here - the confirmation message stands in for it.
      setForm(initialForm)
      setStatus("done")
      setTimeout(() => {
        setStatus("idle")
        setOpen(false)
      }, 4000)
    } catch {
      setError("Could not reach the server.")
      setStatus("idle")
    }
  }

  return (
    <section id="guestbook" className="relative overflow-hidden bg-secondary py-24">
      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-gold/5 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-gold">Guestbook</p>
          <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            Say hello
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            If you stopped by, leave a note. It is entirely optional &mdash; and it is the
            only way I get to know who has been here.
          </p>
        </motion.div>

        {/* Sign the guestbook */}
        <div className="mx-auto mb-12 max-w-2xl">
          {!open ? (
            <button
              onClick={() => setOpen(true)}
              className="group mx-auto flex items-center gap-2 rounded-full border border-gold/40 bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold hover:bg-gold hover:text-charcoal"
            >
              <PenLine className="h-4 w-4 text-gold transition-colors group-hover:text-charcoal" />
              Sign the guestbook
            </button>
          ) : status === "done" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-gold/40 bg-background p-6 text-center"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Check className="h-5 w-5" />
              </div>
              <p className="font-medium text-foreground">Thank you for signing.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your note has been sent to Ishaan and will appear here once he has
                read it.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleSubmit}
              className="rounded-lg border border-border bg-background p-6 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  maxLength={60}
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name *"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  maxLength={80}
                  value={form.role}
                  onChange={update("role")}
                  placeholder="Role (e.g. Recruiter)"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  maxLength={80}
                  value={form.company}
                  onChange={update("company")}
                  placeholder="Company"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  maxLength={300}
                  value={form.link}
                  onChange={update("link")}
                  placeholder="LinkedIn / site (optional)"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>

              <textarea
                required
                maxLength={400}
                rows={3}
                value={form.message}
                onChange={update("message")}
                placeholder="Your message *"
                className="mt-4 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
              />

              {/* Honeypot - hidden from people, tempting to bots. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={update("website")}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-[11px] text-muted-foreground">
                  Reviewed before it appears publicly. Please do not post private details.
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className="flex items-center gap-2 rounded-md bg-gold px-5 py-2 text-sm font-medium text-charcoal transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                    Sign
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </div>

        {/* The wall */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {entries.map((entry, index) => (
              <motion.article
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
                className="rounded-lg border border-border bg-background p-5 transition-colors hover:border-gold/40"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 font-mono text-sm font-semibold text-gold">
                    {initials(entry.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium text-foreground">{entry.name}</h3>
                      {entry.link && (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer nofollow ugc"
                          className="text-muted-foreground transition-colors hover:text-gold"
                          aria-label={`Open ${entry.name}'s link`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {[entry.role, entry.company].filter(Boolean).join(" · ") || "Visitor"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-foreground/80">{entry.message}</p>

                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
                  {timeAgo(entry.created_at)}
                  {entry.country ? ` · ${entry.country}` : ""}
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {entries.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No signatures yet. Be the first.
          </p>
        )}
      </div>
    </section>
  )
}
