import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  ShoppingBag,
  Settings,
  User,
  Mail,
  Lock,
  Package,
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { mockContracts, mockBeats } from "@/mocks"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  DownloadButton,
  Input,
  Label,
} from "@/components/ui"

type Tab = "purchases" | "settings"

async function simulateDownload() {
  await new Promise((res) => setTimeout(res, 1200))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AccountPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuthStore()

  const [activeTab, setActiveTab] = useState<Tab>("purchases")

  // Settings state
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Enrich purchases with contract + beat data, newest first
  const purchases = currentUser?.purchases ?? []
  const enriched = [...purchases]
    .sort(
      (a, b) =>
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
    )
    .map((p) => {
      const contract = mockContracts.find((c) => c.id === p.contractId)
      const beat = mockBeats.find((b) => b.id === p.beatId)
      return {
        ...p,
        price: contract?.price ?? 0,
        artUrl: beat?.artUrl,
        mp3Url: beat?.mp3Url,
      }
    })

  const handleEmailSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }
    setSavingEmail(true)
    await new Promise((res) => setTimeout(res, 800))
    setSavingEmail(false)
    setNewEmail("")
    toast.success("Email updated")
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error("Enter your current password")
      return
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setSavingPassword(true)
    await new Promise((res) => setTimeout(res, 800))
    setSavingPassword(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    toast.success("Password updated")
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "purchases", label: "Purchases", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-[calc(var(--navbar-height)+2.5rem)] sm:px-6">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex items-center gap-3"
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              "color-mix(in srgb, var(--color-accent-hero) 14%, var(--card))",
            border:
              "1px solid color-mix(in srgb, var(--color-accent-hero) 28%, transparent)",
          }}
        >
          <User size={18} style={{ color: "var(--color-accent-hero)" }} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-text">
            My Account
          </h1>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground/55">
            {currentUser?.email ?? "—"}
          </p>
        </div>
      </motion.div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="mb-6 flex border-b border-border/40">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-1.5 px-5 pb-3 pt-1 text-sm font-medium transition-colors"
              style={{
                color: isActive
                  ? "var(--color-accent-hero)"
                  : "var(--muted-foreground)",
              }}
            >
              <Icon size={14} />
              {tab.label}
              {tab.id === "purchases" && purchases.length > 0 && (
                <span
                  className="ml-0.5 rounded-full px-1.5 py-px font-mono text-[0.6rem] font-bold"
                  style={{
                    background: "rgba(199,119,139,0.15)",
                    color: "var(--color-accent-hero)",
                    border: "1px solid rgba(199,119,139,0.25)",
                  }}
                >
                  {purchases.length}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="account-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-[2px] rounded-full"
                  style={{ background: "var(--color-accent-hero)" }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* ── Purchases tab ─────────────────────────────────────────────── */}
        {activeTab === "purchases" && (
          <motion.div
            key="purchases"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {enriched.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/60 bg-card px-6 py-16 text-center">
                <div
                  className="flex size-14 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(199,119,139,0.08)",
                    border: "1px solid rgba(199,119,139,0.18)",
                  }}
                >
                  <Package
                    size={26}
                    style={{ color: "var(--color-accent-hero)" }}
                  />
                </div>
                <div>
                  <p className="font-heading text-base font-bold text-brand-text/80">
                    No purchases yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground/50">
                    Browse the catalog and license a beat to get started.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  Browse Beats
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
                {/* Panel header */}
                <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
                  <ShoppingBag
                    size={14}
                    style={{ color: "var(--color-accent-hero)" }}
                  />
                  <span className="text-sm font-semibold text-brand-text/90">
                    Licensed Contracts
                  </span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground/40">
                    {enriched.length}{" "}
                    {enriched.length === 1 ? "contract" : "contracts"}
                  </span>
                </div>

                <Table>
                  <TableHeader>
                    <tr>
                      <TableHead>Beat</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Purchased</TableHead>
                      <TableHead>Downloads</TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {enriched.map((p, i) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: i * 0.07,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="border-b border-primary/10 transition-colors hover:bg-primary/5"
                      >
                        {/* Beat */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {p.artUrl && (
                              <img
                                src={p.artUrl}
                                alt={p.beatTitle}
                                className="size-9 shrink-0 rounded-md object-cover"
                              />
                            )}
                            <span className="font-medium text-brand-text/90">
                              {p.beatTitle}
                            </span>
                          </div>
                        </TableCell>

                        {/* Coverage type */}
                        <TableCell>
                          <span
                            className="rounded px-1.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider"
                            style={
                              p.coverageType === "wav+trackout"
                                ? {
                                    background: "rgba(127,86,174,0.15)",
                                    color: "var(--color-accent-2)",
                                    border:
                                      "1px solid rgba(127,86,174,0.25)",
                                  }
                                : {
                                    background: "rgba(127,222,255,0.10)",
                                    color: "var(--color-accent-3)",
                                    border:
                                      "1px solid rgba(127,222,255,0.20)",
                                  }
                            }
                          >
                            {p.coverageType === "wav+trackout"
                              ? "WAV + ZIP"
                              : "WAV"}
                          </span>
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          <span
                            className="font-mono font-semibold"
                            style={{ color: "var(--color-accent-hero)" }}
                          >
                            ${p.price.toFixed(2)}
                          </span>
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <span className="font-mono text-xs text-muted-foreground/60">
                            {formatDate(p.purchasedAt)}
                          </span>
                        </TableCell>

                        {/* Downloads */}
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <DownloadButton
                              label="MP3"
                              onDownload={async () => {
                                await simulateDownload()
                                toast.success(
                                  `${p.beatTitle} — MP3 download started`
                                )
                              }}
                            />
                            <DownloadButton
                              label="WAV"
                              onDownload={async () => {
                                await simulateDownload()
                                toast.success(
                                  `${p.beatTitle} — WAV download started`
                                )
                              }}
                            />
                            {p.coverageType === "wav+trackout" && (
                              <DownloadButton
                                label="ZIP"
                                onDownload={async () => {
                                  await simulateDownload()
                                  toast.success(
                                    `${p.beatTitle} — Trackout ZIP download started`
                                  )
                                }}
                              />
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Settings tab ──────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {/* ── Email section ─────────────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
              <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
                <Mail
                  size={14}
                  style={{ color: "var(--color-accent-3)" }}
                />
                <span className="text-sm font-semibold text-brand-text/90">
                  Update Email
                </span>
              </div>
              <form
                onSubmit={handleEmailSave}
                className="space-y-4 px-5 py-5"
              >
                <div>
                  <Label className="mb-1.5">Current Email</Label>
                  <div className="flex h-9 items-center rounded-lg border border-primary/20 bg-background/30 px-3 font-mono text-sm text-muted-foreground/60">
                    {currentUser?.email ?? "—"}
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-email" className="mb-1.5">
                    New Email Address
                  </Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="your@newemail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <SaveButton loading={savingEmail} label="Save Changes" />
                </div>
              </form>
            </div>

            {/* ── Password section ──────────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
              <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
                <Lock
                  size={14}
                  style={{ color: "var(--color-accent-2)" }}
                />
                <span className="text-sm font-semibold text-brand-text/90">
                  Change Password
                </span>
              </div>
              <form
                onSubmit={handlePasswordSave}
                className="space-y-4 px-5 py-5"
              >
                <div>
                  <Label htmlFor="current-pw" className="mb-1.5">
                    Current Password
                  </Label>
                  <Input
                    id="current-pw"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="new-pw" className="mb-1.5">
                      New Password
                    </Label>
                    <Input
                      id="new-pw"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-pw" className="mb-1.5">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-pw"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <SaveButton loading={savingPassword} label="Update Password" />
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Small internal component ───────────────────────────────────────────────
function SaveButton({
  loading,
  label,
}: {
  loading: boolean
  label: string
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 disabled:opacity-60"
    >
      {loading ? (
        <>
          <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Saving…
        </>
      ) : (
        label
      )}
    </button>
  )
}
