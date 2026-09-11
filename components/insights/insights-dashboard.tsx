"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Activity,
  Check,
  Copy,
  Eye,
  Globe,
  Link2,
  LogOut,
  RefreshCw,
  Trash2,
  Users,
  EyeOff,
} from "lucide-react"

type Payload = {
  ok: boolean
  days: number
  totals: { views: number; visitors: number; views24h: number; views7d: number; countries: number; refCodes: number }
  daily: { day: string; views: number; visitors: number }[]
  referrers: { source: string; views: number }[]
  links: { code: string; label: string; note: string | null; views: number; visitors: number; lastSeen: string | null }[]
  countries: { country: string; views: number }[]
  devices: { name: string; views: number }[]
  browsers: { name: string; views: number }[]
  recent: {
    visitor: string
    path: string
    refCode: string | null
    referrer: string | null
    country: string | null
    city: string | null
    device: string
    browser: string
    os: string
    createdAt: string
  }[]
  returning: { visitor: string; views: number; firstSeen: string; lastSeen: string; country: string | null }[]
  guestbook: {
    id: number
    name: string
    role: string | null
    company: string | null
    message: string
    link: string | null
    country: string | null
    approved: boolean
    createdAt: string
  }[]
}

const TABS = ["Overview", "Visitors", "Tracked links", "Guestbook"] as const
type Tab = (typeof TABS)[number]

const RANGES = [7, 30, 90, 365]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{title}</h2>
      {children}
    </section>
  )
}

/** Horizontal bar list - used for referrers, countries, devices and browsers. */
function BarList({ rows, empty }: { rows: { label: string; value: number }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((row) => row.value))

  if (rows.length === 0) return <p className="text-sm text-white/40">{empty}</p>

  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.label} className="relative overflow-hidden rounded px-3 py-2">
          <div
            className="absolute inset-y-0 left-0 rounded bg-gold/15"
            style={{ width: `${(row.value / max) * 100}%` }}
          />
          <div className="relative flex items-center justify-between gap-4 text-sm">
            <span className="truncate text-white/80">{row.label}</span>
            <span className="shrink-0 font-mono tabular-nums text-white/60">{row.value}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function Kpi({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold">
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-mono text-3xl font-bold tabular-nums text-white">
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-white/40">{label}</div>
    </div>
  )
}

export function InsightsDashboard() {
  const router = useRouter()
  const [data, setData] = useState<Payload | null>(null)
  const [days, setDays] = useState(30)
  const [tab, setTab] = useState<Tab>("Overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [newLink, setNewLink] = useState({ code: "", label: "", note: "" })

  useEffect(() => setOrigin(window.location.origin), [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/insights/data?days=${days}`)
      if (res.status === 401) {
        router.refresh()
        return
      }
      const json = await res.json()
      if (!json.ok) {
        setError(json.error ?? "Could not load data.")
      } else {
        setError(null)
        setData(json)
      }
    } catch {
      setError("Could not reach the server.")
    } finally {
      setLoading(false)
    }
  }, [days, router])

  useEffect(() => {
    void load()
  }, [load])

  async function logout() {
    await fetch("/api/insights/login", { method: "DELETE" })
    router.refresh()
  }

  async function createLink(event: FormEvent) {
    event.preventDefault()
    const res = await fetch("/api/insights/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLink),
    })
    if (res.ok) {
      setNewLink({ code: "", label: "", note: "" })
      void load()
    }
  }

  async function deleteLink(code: string) {
    await fetch(`/api/insights/links?code=${encodeURIComponent(code)}`, { method: "DELETE" })
    void load()
  }

  async function setApproved(id: number, approved: boolean) {
    await fetch("/api/insights/guestbook", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved }),
    })
    void load()
  }

  async function deleteEntry(id: number) {
    await fetch(`/api/insights/guestbook?id=${id}`, { method: "DELETE" })
    void load()
  }

  function copy(text: string, key: string) {
    void navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const chartData = useMemo(
    () =>
      (data?.daily ?? []).map((row) => ({
        ...row,
        label: new Date(row.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      })),
    [data]
  )

  return (
    <main className="min-h-screen bg-charcoal px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Portfolio Insights</h1>
            <p className="mt-1 text-sm text-white/40">
              Who is looking, where they came from, and what brought them.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void load()}
              className="flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-white/70 hover:border-gold hover:text-gold"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => void logout()}
              className="flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-white/70 hover:border-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </header>

        {error && (
          <p className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
            {error}
          </p>
        )}

        {/* Tabs + range */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
          <nav className="flex gap-1">
            {TABS.map((name) => (
              <button
                key={name}
                onClick={() => setTab(name)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm transition-colors ${
                  tab === name
                    ? "border-gold text-gold"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                {name}
              </button>
            ))}
          </nav>
          <div className="flex gap-1 pb-2">
            {RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setDays(range)}
                className={`rounded px-2.5 py-1 font-mono text-xs ${
                  days === range ? "bg-gold text-charcoal" : "text-white/40 hover:text-white/70"
                }`}
              >
                {range}d
              </button>
            ))}
          </div>
        </div>

        {!data ? (
          <p className="py-20 text-center text-sm text-white/40">Loading…</p>
        ) : (
          <>
            {tab === "Overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Kpi icon={Eye} label="Total views" value={data.totals.views} />
                  <Kpi icon={Users} label="Unique visitors" value={data.totals.visitors} />
                  <Kpi icon={Activity} label="Views (24h)" value={data.totals.views24h} />
                  <Kpi icon={Globe} label="Countries" value={data.totals.countries} />
                </div>

                <Panel title={`Traffic · last ${days} days`}>
                  {chartData.length === 0 ? (
                    <p className="py-12 text-center text-sm text-white/40">
                      No views recorded in this window yet.
                    </p>
                  ) : (
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                          <defs>
                            <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#C9A227" stopOpacity={0.5} />
                              <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="#ffffff12" vertical={false} />
                          <XAxis
                            dataKey="label"
                            stroke="#ffffff40"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                          />
                          <YAxis
                            stroke="#ffffff40"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#111111",
                              border: "1px solid #ffffff20",
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                            labelStyle={{ color: "#ffffff80" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#C9A227"
                            strokeWidth={2}
                            fill="url(#viewsFill)"
                          />
                          <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#ffffff60"
                            strokeWidth={1.5}
                            fill="none"
                            strokeDasharray="4 3"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Panel title="Where they came from">
                    <BarList
                      rows={data.referrers.map((row) => ({ label: row.source, value: row.views }))}
                      empty="No referrer data yet."
                    />
                  </Panel>
                  <Panel title="Countries">
                    <BarList
                      rows={data.countries.map((row) => ({ label: row.country, value: row.views }))}
                      empty="Geo data appears when deployed behind Vercel or Cloudflare."
                    />
                  </Panel>
                  <Panel title="Devices">
                    <BarList
                      rows={data.devices.map((row) => ({ label: row.name, value: row.views }))}
                      empty="No device data yet."
                    />
                  </Panel>
                  <Panel title="Browsers">
                    <BarList
                      rows={data.browsers.map((row) => ({ label: row.name, value: row.views }))}
                      empty="No browser data yet."
                    />
                  </Panel>
                </div>
              </div>
            )}

            {tab === "Visitors" && (
              <div className="space-y-6">
                <Panel title="Returning visitors">
                  {data.returning.length === 0 ? (
                    <p className="text-sm text-white/40">Nobody has come back twice yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px] text-sm">
                        <thead className="text-left font-mono text-[11px] uppercase tracking-wider text-white/35">
                          <tr>
                            <th className="pb-2">Visitor</th>
                            <th className="pb-2">Views</th>
                            <th className="pb-2">Country</th>
                            <th className="pb-2">First seen</th>
                            <th className="pb-2">Last seen</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {data.returning.map((row) => (
                            <tr key={row.visitor}>
                              <td className="py-2 font-mono text-gold">{row.visitor}</td>
                              <td className="py-2 tabular-nums text-white/70">{row.views}</td>
                              <td className="py-2 text-white/60">{row.country ?? "—"}</td>
                              <td className="py-2 text-white/50">{formatDate(row.firstSeen)}</td>
                              <td className="py-2 text-white/50">{formatDate(row.lastSeen)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Panel>

                <Panel title="Recent visits">
                  {data.recent.length === 0 ? (
                    <p className="text-sm text-white/40">No visits recorded yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-sm">
                        <thead className="text-left font-mono text-[11px] uppercase tracking-wider text-white/35">
                          <tr>
                            <th className="pb-2">When</th>
                            <th className="pb-2">Visitor</th>
                            <th className="pb-2">Location</th>
                            <th className="pb-2">Source</th>
                            <th className="pb-2">Link</th>
                            <th className="pb-2">Device</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {data.recent.map((row, index) => (
                            <tr key={`${row.visitor}-${index}`}>
                              <td className="whitespace-nowrap py-2 text-white/50">
                                {formatDate(row.createdAt)}
                              </td>
                              <td className="py-2 font-mono text-gold">{row.visitor}</td>
                              <td className="py-2 text-white/60">
                                {[row.city, row.country].filter(Boolean).join(", ") || "—"}
                              </td>
                              <td className="py-2 text-white/60">{row.referrer ?? "Direct"}</td>
                              <td className="py-2">
                                {row.refCode ? (
                                  <span className="rounded bg-gold/15 px-2 py-0.5 font-mono text-[11px] text-gold">
                                    {row.refCode}
                                  </span>
                                ) : (
                                  <span className="text-white/30">—</span>
                                )}
                              </td>
                              <td className="py-2 text-white/50">
                                {row.device} · {row.browser}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <p className="mt-4 text-[11px] leading-relaxed text-white/30">
                    &ldquo;Visitor&rdquo; is the first 8 characters of a salted hash. It lets you
                    recognise a returning person without storing their IP address.
                  </p>
                </Panel>
              </div>
            )}

            {tab === "Tracked links" && (
              <div className="space-y-6">
                <Panel title="Create a tracked link">
                  <form onSubmit={createLink} className="grid gap-3 sm:grid-cols-4">
                    <input
                      required
                      value={newLink.code}
                      onChange={(event) => setNewLink({ ...newLink, code: event.target.value })}
                      placeholder="code (e.g. google-hr)"
                      className="rounded-md border border-white/15 bg-white/5 px-3 py-2 font-mono text-sm outline-none focus:border-gold"
                    />
                    <input
                      required
                      value={newLink.label}
                      onChange={(event) => setNewLink({ ...newLink, label: event.target.value })}
                      placeholder="Who is it for?"
                      className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold"
                    />
                    <input
                      value={newLink.note}
                      onChange={(event) => setNewLink({ ...newLink, note: event.target.value })}
                      placeholder="Note (optional)"
                      className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-charcoal hover:opacity-90"
                    >
                      Create
                    </button>
                  </form>
                  <p className="mt-3 text-[11px] text-white/35">
                    Share the generated URL with one person. When it is opened, that code shows
                    up below and in Recent visits &mdash; the closest you can honestly get to
                    &ldquo;who saw me&rdquo;.
                  </p>
                </Panel>

                <Panel title="Link performance">
                  {data.links.length === 0 ? (
                    <p className="text-sm text-white/40">No tracked links yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[680px] text-sm">
                        <thead className="text-left font-mono text-[11px] uppercase tracking-wider text-white/35">
                          <tr>
                            <th className="pb-2">Label</th>
                            <th className="pb-2">URL</th>
                            <th className="pb-2">Opens</th>
                            <th className="pb-2">People</th>
                            <th className="pb-2">Last opened</th>
                            <th className="pb-2" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {data.links.map((row) => {
                            const url = `${origin}/?ref=${row.code}`
                            return (
                              <tr key={row.code}>
                                <td className="py-2">
                                  <div className="text-white/80">{row.label}</div>
                                  {row.note && (
                                    <div className="text-[11px] text-white/40">{row.note}</div>
                                  )}
                                </td>
                                <td className="py-2">
                                  <button
                                    onClick={() => copy(url, row.code)}
                                    className="flex items-center gap-2 font-mono text-[11px] text-white/50 hover:text-gold"
                                  >
                                    {copied === row.code ? (
                                      <Check className="h-3 w-3 text-gold" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                    /?ref={row.code}
                                  </button>
                                </td>
                                <td className="py-2 tabular-nums text-white/70">{row.views}</td>
                                <td className="py-2 tabular-nums text-white/70">{row.visitors}</td>
                                <td className="py-2 text-white/50">
                                  {row.lastSeen ? formatDate(row.lastSeen) : "Not yet opened"}
                                </td>
                                <td className="py-2 text-right">
                                  <button
                                    onClick={() => void deleteLink(row.code)}
                                    className="text-white/30 hover:text-destructive"
                                    aria-label={`Delete ${row.label}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Panel>
              </div>
            )}

            {tab === "Guestbook" && (
              <Panel title={`Signatures (${data.guestbook.length})`}>
                {data.guestbook.length === 0 ? (
                  <p className="text-sm text-white/40">Nobody has signed yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {data.guestbook.map((entry) => (
                      <li
                        key={entry.id}
                        className={`rounded-md border p-4 ${
                          entry.approved ? "border-white/10" : "border-white/5 opacity-50"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{entry.name}</span>
                              {entry.link && (
                                <a
                                  href={entry.link}
                                  target="_blank"
                                  rel="noopener noreferrer nofollow"
                                  className="font-mono text-[11px] text-gold hover:underline"
                                >
                                  <Link2 className="inline h-3 w-3" /> link
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-white/40">
                              {[entry.role, entry.company, entry.country].filter(Boolean).join(" · ") ||
                                "Visitor"}{" "}
                              · {formatDate(entry.createdAt)}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() => void setApproved(entry.id, !entry.approved)}
                              className="flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1 text-xs text-white/60 hover:border-gold hover:text-gold"
                            >
                              {entry.approved ? (
                                <>
                                  <EyeOff className="h-3 w-3" /> Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3" /> Show
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => void deleteEntry(entry.id)}
                              className="rounded border border-white/15 px-2.5 py-1 text-xs text-white/40 hover:border-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-white/70">{entry.message}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            )}
          </>
        )}
      </div>
    </main>
  )
}
