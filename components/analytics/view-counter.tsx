"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Eye, Users, Globe, Activity } from "lucide-react"

type Stats = {
  views: number
  visitors: number
  last24h: number
  countries: number
}

/** Counts up to `value` once the element scrolls into view. */
function useCountUp(value: number, active: boolean, duration = 1200): number {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active || value <= 0) {
      setDisplay(value > 0 && !active ? 0 : value)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // Ease-out cubic, so the number decelerates into its final value.
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, active, duration])

  return display
}

function Stat({
  icon: Icon,
  value,
  label,
  active,
  delay,
}: {
  icon: typeof Eye
  value: number
  label: string
  active: boolean
  delay: number
}) {
  const display = useCountUp(value, active)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
        <Icon className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <div className="font-mono text-xl font-semibold tabular-nums text-white">
          {display.toLocaleString()}
        </div>
        <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      </div>
    </motion.div>
  )
}

/**
 * The public-facing counter. Deliberately aggregate-only: totals and a country
 * count, never an individual visitor.
 */
export function ViewCounter() {
  const [stats, setStats] = useState<Stats | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  useEffect(() => {
    let cancelled = false

    const load = () => {
      fetch("/api/stats")
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled && data?.ok) setStats(data)
        })
        .catch(() => {
          /* the counter simply stays hidden */
        })
    }

    load()
    // Refresh once this visit has been recorded, so the number includes you.
    const onTracked = () => setTimeout(load, 400)
    window.addEventListener("portfolio:view-tracked", onTracked)

    return () => {
      cancelled = true
      window.removeEventListener("portfolio:view-tracked", onTracked)
    }
  }, [])

  // The ref'd element must stay mounted: useInView observes whatever node is
  // present when its effect runs, and swapping the node out would leave the
  // observer watching a detached element (counters stuck at zero).
  return (
    <div ref={ref} className="mx-auto max-w-3xl">
      {!stats ? null : (
        <>
      <div className="mb-6 text-center">
        <p className="font-serif text-lg text-white/80">You are visitor number</p>
        <p className="mt-1 font-mono text-4xl font-bold text-gold tabular-nums">
          {stats.visitors.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
        <Stat icon={Eye} value={stats.views} label="Total views" active={inView} delay={0} />
        <Stat icon={Users} value={stats.visitors} label="Visitors" active={inView} delay={0.08} />
        <Stat icon={Activity} value={stats.last24h} label="Last 24h" active={inView} delay={0.16} />
        <Stat icon={Globe} value={stats.countries} label="Countries" active={inView} delay={0.24} />
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-white/35">
        Counts only. No IP addresses are stored &mdash; visitors are counted using a
        salted, irreversible hash.
      </p>
        </>
      )}
    </div>
  )
}
