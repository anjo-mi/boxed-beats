import { motion } from "motion/react"
import { useNavigate } from "@tanstack/react-router"
import {
  Music2,
  FileSignature,
  Users2,
  DollarSign,
  Plus,
  ArrowRight,
  ShoppingBag,
  Disc3,
} from "lucide-react"
import { mockBeats, mockContracts, mockUsers } from "@/mocks"
import { routePaths } from "@/constants/routePaths"

// ── Derived stats ──────────────────────────────────────────────────────────
const allPurchases = mockUsers.flatMap((u) => u.purchases ?? [])

const totalRevenue = allPurchases.reduce((sum, p) => {
  const contract = mockContracts.find((c) => c.id === p.contractId)
  return sum + (contract?.price ?? 0)
}, 0)

const nonAdminUsers = mockUsers.filter((u) => u.role !== "admin")

const recentBeats = [...mockBeats]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5)

const recentSales = [...allPurchases]
  .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
  .slice(0, 5)
  .map((p) => {
    const contract = mockContracts.find((c) => c.id === p.contractId)
    const buyer = mockUsers.find((u) =>
      u.purchases.some((pu) => pu.id === p.id)
    )
    return { ...p, price: contract?.price ?? 0, buyerEmail: buyer?.email ?? "unknown" }
  })

// ── Animation helpers ──────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

// ── Stat card data ─────────────────────────────────────────────────────────
const stats = [
  {
    label: "Beats Uploaded",
    value: mockBeats.length,
    icon: Music2,
    accentVar: "var(--color-accent-hero)",
    link: routePaths.adminBeats,
  },
  {
    label: "Active Contracts",
    value: mockContracts.length,
    icon: FileSignature,
    accentVar: "var(--color-accent-2)",
    link: routePaths.adminContracts,
  },
  {
    label: "Registered Users",
    value: nonAdminUsers.length,
    icon: Users2,
    accentVar: "var(--color-accent-3)",
    link: routePaths.adminUsers,
  },
  {
    label: "Total Revenue",
    value: `$${totalRevenue.toFixed(2)}`,
    icon: DollarSign,
    accentVar: "var(--color-primary)",
    link: null,
  },
]

// ── Quick action data ──────────────────────────────────────────────────────
const quickActions = [
  {
    label: "Add New Beat",
    desc: "Upload a track and its files",
    icon: Plus,
    accent: "var(--color-accent-hero)",
    link: routePaths.adminBeatNew,
    primary: true,
  },
  {
    label: "Add New Contract",
    desc: "Create a licensing contract",
    icon: Plus,
    accent: "var(--color-accent-2)",
    link: routePaths.adminContractNew,
    primary: true,
  },
  {
    label: "Manage Beats",
    desc: "Browse, play and edit beats",
    icon: Disc3,
    accent: "var(--color-accent-hero)",
    link: routePaths.adminBeats,
    primary: false,
  },
  {
    label: "Manage Contracts",
    desc: "Edit pricing and coverage",
    icon: FileSignature,
    accent: "var(--color-accent-2)",
    link: routePaths.adminContracts,
    primary: false,
  },
  {
    label: "View Users",
    desc: "See registered accounts",
    icon: Users2,
    accent: "var(--color-accent-3)",
    link: routePaths.adminUsers,
    primary: false,
  },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-[calc(var(--navbar-height)+2.5rem)] sm:px-6">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <div className="flex items-end gap-3">
          <h1 className="font-heading text-3xl font-bold text-brand-text">
            Dashboard
          </h1>
          <span
            className="mb-0.5 rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(199,119,139,0.12)",
              color: "var(--color-accent-hero)",
              border: "1px solid rgba(199,119,139,0.25)",
            }}
          >
            Admin
          </span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground/60">
          Your catalog at a glance — manage beats, contracts, and accounts.
        </p>
      </motion.div>

      {/* ── Stat cards ────────────────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              onClick={() => stat.link && navigate({ to: stat.link })}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-colors"
              style={{ cursor: stat.link ? "pointer" : "default" }}
            >
              {/* Accent top line */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] opacity-70 transition-opacity group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.accentVar}, transparent)`,
                }}
              />

              {/* Subtle inner glow */}
              <div
                className="pointer-events-none absolute -top-8 left-1/2 h-16 w-32 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
                style={{ background: stat.accentVar }}
              />

              {/* Icon badge */}
              <div
                className="mb-4 inline-flex items-center justify-center rounded-lg p-2.5"
                style={{
                  background: `color-mix(in srgb, ${stat.accentVar} 14%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${stat.accentVar} 28%, transparent)`,
                }}
              >
                <Icon size={18} style={{ color: stat.accentVar }} />
              </div>

              {/* Value */}
              <div
                className="font-mono text-3xl font-bold leading-none tracking-tight"
                style={{ color: "var(--color-text)" }}
              >
                {stat.value}
              </div>

              {/* Label */}
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground/70">
                  {stat.label}
                </span>
                {stat.link && (
                  <ArrowRight
                    size={12}
                    className="translate-x-0 text-muted-foreground/30 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    style={{ color: stat.accentVar }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Quick actions ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <h2 className="mb-4 font-heading text-base font-bold tracking-wide text-brand-text/80">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate({ to: action.link })}
                className="group relative flex flex-col items-start gap-2 overflow-hidden rounded-xl border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5"
                style={
                  action.primary
                    ? {
                        background: `color-mix(in srgb, ${action.accent} 10%, var(--card))`,
                        borderColor: `color-mix(in srgb, ${action.accent} 35%, transparent)`,
                      }
                    : {
                        background: "var(--card)",
                        borderColor: "var(--border)",
                      }
                }
              >
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 30% 50%, color-mix(in srgb, ${action.accent} 8%, transparent) 0%, transparent 70%)`,
                  }}
                />

                <div
                  className="inline-flex items-center justify-center rounded-md p-1.5"
                  style={{
                    background: `color-mix(in srgb, ${action.accent} 16%, transparent)`,
                    color: action.accent,
                  }}
                >
                  <Icon size={14} />
                </div>

                <div>
                  <div
                    className="text-sm font-semibold leading-tight"
                    style={{ color: "var(--color-text)" }}
                  >
                    {action.label}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground/55">
                    {action.desc}
                  </div>
                </div>

                <ArrowRight
                  size={12}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-200 group-hover:opacity-60"
                  style={{ color: action.accent }}
                />
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ── Recent activity ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-5 lg:grid-cols-2"
      >
        {/* Recent beats */}
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          {/* Section header */}
          <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Music2 size={14} style={{ color: "var(--color-accent-hero)" }} />
              <span className="text-sm font-semibold text-brand-text/90">
                Recent Beats
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: routePaths.adminBeats })}
              className="flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground"
            >
              View all
              <ArrowRight size={10} />
            </button>
          </div>

          <ul className="divide-y divide-border/30">
            {recentBeats.map((beat, i) => (
              <motion.li
                key={beat.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.5 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-primary/5"
              >
                {/* Art thumbnail */}
                <img
                  src={beat.artUrl}
                  alt={beat.title}
                  className="size-8 shrink-0 rounded-md object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-brand-text/90">
                    {beat.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-muted-foreground/50">
                      {beat.bpm} BPM
                    </span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-xs text-muted-foreground/50">
                      {beat.tags.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </div>

                <span className="shrink-0 text-xs text-muted-foreground/40">
                  {formatDate(beat.createdAt)}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Recent sales */}
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <ShoppingBag size={14} style={{ color: "var(--color-accent-2)" }} />
              <span className="text-sm font-semibold text-brand-text/90">
                Recent Sales
              </span>
            </div>
            <span className="rounded px-2 py-0.5 font-mono text-xs font-semibold"
              style={{
                background: "rgba(127,86,174,0.12)",
                color: "var(--color-accent-2)",
                border: "1px solid rgba(127,86,174,0.22)",
              }}
            >
              {allPurchases.length} total
            </span>
          </div>

          {recentSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <ShoppingBag size={28} className="text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground/40">No sales yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/30">
              {recentSales.map((sale, i) => (
                <motion.li
                  key={sale.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.5 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-primary/5"
                >
                  {/* Coverage badge */}
                  <div
                    className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={
                      sale.coverageType === "wav+trackout"
                        ? {
                            background: "rgba(127,86,174,0.15)",
                            color: "var(--color-accent-2)",
                            border: "1px solid rgba(127,86,174,0.25)",
                          }
                        : {
                            background: "rgba(127,222,255,0.10)",
                            color: "var(--color-accent-3)",
                            border: "1px solid rgba(127,222,255,0.20)",
                          }
                    }
                  >
                    {sale.coverageType === "wav+trackout" ? "WAV+ZIP" : "WAV"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-brand-text/90">
                      {sale.beatTitle}
                    </p>
                    <p className="truncate text-xs text-muted-foreground/50">
                      {sale.buyerEmail}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className="font-mono text-sm font-bold"
                      style={{ color: "var(--color-accent-hero)" }}
                    >
                      ${sale.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground/40">
                      {formatDate(sale.purchasedAt)}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  )
}
