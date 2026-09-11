"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Loader2 } from "lucide-react"

export function InsightsLogin({ configured }: { configured: boolean }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)

    try {
      const res = await fetch("/api/insights/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Incorrect password.")
        setBusy(false)
        return
      }

      router.refresh()
    } catch {
      setError("Could not reach the server.")
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Portfolio Insights</h1>
          <p className="mt-2 text-sm text-white/50">Private. Enter the dashboard password.</p>
        </div>

        {!configured ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-white/80">
            <code className="font-mono text-gold">INSIGHTS_PASSWORD</code> is not set on the
            server. Add it to your environment variables and restart.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold"
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gold px-4 py-3 text-sm font-medium text-charcoal transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Unlock
            </button>
          </form>
        )}
      </motion.div>
    </main>
  )
}
