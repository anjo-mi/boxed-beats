import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import Countdown from "react-countdown"
import {
  ShoppingBag,
  X,
  Lock,
  ArrowRight,
  Clock,
  LogIn,
  UserPlus,
  CreditCard,
} from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { DiscountBadge, ConfirmationDialog } from "@/components/ui"
import { AuthModal } from "@/components/layout/AuthModal"
import { routePaths } from "@/constants/routePaths"
// Braintree sandbox tokenization key (demo — no real charges)
const BRAINTREE_TOKEN = "sandbox_g42y39zw_348pk9cgf3bgyw2b"

function effectivePrice(price: number, discount?: number) {
  if (!discount) return price
  return price * (1 - discount / 100)
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, removeItem, clearCart } = useCartStore()
  const { role } = useAuthStore()

  const [authOpen, setAuthOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [processing, setProcessing] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dropinInstance, setDropinInstance] = useState<any>(null)
  const [demoMode, setDemoMode] = useState(false)
  const dropinRef = useRef<HTMLDivElement>(null)

  // Totals
  const subtotal = items.reduce((s, i) => s + i.contract.price, 0)
  const savings = items.reduce((s, i) => {
    return s + (i.contract.price - effectivePrice(i.contract.price, i.contract.discount))
  }, 0)
  const total = subtotal - savings

  // Inject Braintree dropin stylesheet once
  useEffect(() => {
    const id = "braintree-dropin-css"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = "https://js.braintreegateway.com/web/dropin/1.46.1/css/dropin.css"
    document.head.appendChild(link)
  }, [])

  // Mount Braintree drop-in when user is authenticated
  useEffect(() => {
    if (role === "guest" || !dropinRef.current) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let instance: any = null
    setDemoMode(false)

    const init = async () => {
      try {
        const mod = await import("braintree-web-drop-in")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        instance = await (mod.default as any).create({
          authorization: BRAINTREE_TOKEN,
          container: dropinRef.current!,
          card: {
            cardholderName: { required: false },
            overrides: {
              styles: {
                input: {
                  color: "#fef3f3",
                  "font-family": '"Winky Rough", sans-serif',
                  "font-size": "14px",
                },
                ".invalid": { color: "#c7778b" },
                ":focus": { color: "#fef3f3" },
                "::placeholder": { color: "rgba(225,223,223,0.3)" },
              },
            },
          },
        })
        setDropinInstance(instance)
      } catch {
        setDemoMode(true)
      }
    }

    init()

    return () => {
      if (instance) instance.teardown().catch(() => {})
      setDropinInstance(null)
    }
  }, [role])

  const handlePay = async () => {
    if (demoMode) {
      setProcessing(true)
      await new Promise((res) => setTimeout(res, 1500))
      setProcessing(false)
      setShowConfirm(true)
      return
    }
    if (!dropinInstance) return
    setProcessing(true)
    try {
      await dropinInstance.requestPaymentMethod()
      await new Promise((res) => setTimeout(res, 900))
      setShowConfirm(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed. Please try again."
      toast.error(msg)
    } finally {
      setProcessing(false)
    }
  }

  const handleConfirmSuccess = () => {
    clearCart()
    setShowConfirm(false)
    navigate({ to: routePaths.account })
    toast.success("Purchase complete! Your contracts are in My Account.")
  }

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-24 pt-[calc(var(--navbar-height)+3rem)] sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5 rounded-2xl border border-border/60 bg-card px-8 py-16 text-center"
        >
          {/* Top accent line */}
          <div
            className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-accent-hero), transparent)",
            }}
          />
          <div
            className="flex size-16 items-center justify-center rounded-full"
            style={{
              background: "rgba(199,119,139,0.08)",
              border: "1px solid rgba(199,119,139,0.18)",
            }}
          >
            <ShoppingBag size={28} style={{ color: "var(--color-accent-hero)" }} />
          </div>
          <div>
            <p className="font-heading text-xl font-bold text-brand-text">
              Your cart is empty
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground/55">
              Add some contracts from the catalog to get started.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Browse Catalog
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    )
  }

  // ── Full checkout layout ────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-[calc(var(--navbar-height)+2.5rem)] sm:px-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-7"
      >
        <h1 className="font-heading text-2xl font-bold text-brand-text">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground/55">
          Review your order and complete your purchase.
        </p>
      </motion.div>

      {/* ── Order summary ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5 overflow-hidden rounded-xl border border-border/60 bg-card"
      >
        {/* Panel header */}
        <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
          <ShoppingBag size={14} style={{ color: "var(--color-accent-hero)" }} />
          <span className="text-sm font-semibold text-brand-text/90">
            Order Summary
          </span>
          <span className="ml-auto font-mono text-xs text-muted-foreground/40">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Line items */}
        <ul className="divide-y divide-border/30">
          {items.map((item, i) => {
            const { contract, beat } = item
            const eff = effectivePrice(contract.price, contract.discount)
            const hasDiscount = !!contract.discount
            const isExpiring = hasDiscount && !!contract.discountExpiresAt

            return (
              <motion.li
                key={contract.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.15 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-4 px-5 py-4"
              >
                {/* Beat art */}
                <img
                  src={beat.artUrl}
                  alt={beat.title}
                  className="size-12 shrink-0 rounded-lg object-cover"
                />

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-tight text-brand-text/90">
                      {beat.title}
                    </p>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => {
                        removeItem(contract.id)
                        toast(`"${beat.title}" removed from cart`)
                      }}
                      className="shrink-0 rounded p-0.5 text-muted-foreground/30 transition-colors hover:text-brand-accent-hero/70"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  {/* Coverage + discount */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider"
                      style={
                        contract.coverageType === "wav+trackout"
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
                      {contract.coverageType === "wav+trackout"
                        ? "WAV + Trackout ZIP"
                        : "WAV License"}
                    </span>
                    {hasDiscount && <DiscountBadge percent={contract.discount!} />}
                  </div>

                  {/* Expiry countdown */}
                  {isExpiring && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Clock size={10} className="text-amber-400/70" />
                      <span className="text-[0.62rem] text-amber-400/70">
                        Discount expires in:{" "}
                      </span>
                      <Countdown
                        date={new Date(contract.discountExpiresAt!)}
                        renderer={({
                          days,
                          hours,
                          minutes,
                          seconds,
                          completed,
                        }) => {
                          if (completed) {
                            return (
                              <span className="font-mono text-[0.62rem] text-destructive">
                                Expired
                              </span>
                            )
                          }
                          return (
                            <span className="font-mono text-[0.62rem] text-amber-400">
                              {days > 0 && `${days}d `}
                              {hours}h {minutes}m {seconds}s
                            </span>
                          )
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Price column */}
                <div className="shrink-0 text-right">
                  <p
                    className="font-mono text-sm font-bold"
                    style={{ color: "var(--color-accent-hero)" }}
                  >
                    ${eff.toFixed(2)}
                  </p>
                  {hasDiscount && (
                    <p className="font-mono text-xs text-muted-foreground/40 line-through">
                      ${contract.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </motion.li>
            )
          })}
        </ul>

        {/* Totals */}
        <div className="space-y-1.5 border-t border-border/40 px-5 py-4">
          <div className="flex justify-between text-sm text-muted-foreground/60">
            <span>Subtotal</span>
            <span className="font-mono">${subtotal.toFixed(2)}</span>
          </div>
          {savings > 0 && (
            <div
              className="flex justify-between text-sm"
              style={{ color: "var(--color-accent-hero)" }}
            >
              <span>Savings</span>
              <span className="font-mono">−${savings.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border/30 pt-2.5 text-base font-bold text-brand-text">
            <span>Total due</span>
            <span
              className="font-mono"
              style={{ color: "var(--color-accent-hero)" }}
            >
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Payment section ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-xl border border-border/60 bg-card"
      >
        {/* Panel header */}
        <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
          <CreditCard size={14} style={{ color: "var(--color-accent-2)" }} />
          <span className="text-sm font-semibold text-brand-text/90">
            Payment
          </span>
          <span
            className="ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground/50"
            style={{
              background: "rgba(16,80,103,0.12)",
              border: "1px solid rgba(16,80,103,0.22)",
            }}
          >
            <Lock size={9} />
            Secure
          </span>
        </div>

        <div className="px-5 py-5">
          {role === "guest" ? (
            /* ── Guest auth gate ──────────────────────────────────────── */
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              {/* Lock icon with glow */}
              <div className="relative">
                <div
                  className="flex size-14 items-center justify-center rounded-full"
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-primary) 18%, var(--card))",
                    border:
                      "1px solid color-mix(in srgb, var(--color-primary) 38%, transparent)",
                  }}
                >
                  <Lock
                    size={22}
                    style={{ color: "var(--color-accent-3)" }}
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 rounded-full opacity-20 blur-xl"
                  style={{ background: "var(--color-accent-3)" }}
                />
              </div>

              <div>
                <p className="font-heading text-base font-bold text-brand-text">
                  Sign in to complete your purchase
                </p>
                <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground/55">
                  Create an account or sign in to license these beats and
                  access your downloads any time.
                </p>
              </div>

              <div className="flex w-full max-w-[220px] flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  <LogIn size={14} />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-transparent px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-brand-text"
                >
                  <UserPlus size={14} />
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            /* ── Authenticated — Braintree drop-in ───────────────────── */
            <div>
              {demoMode && (
                <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-400/80">
                  Running in sandbox / demo mode — no real charges will be made.
                </div>
              )}

              {/* Braintree mounts here */}
              <div ref={dropinRef} />

              {/* Pay button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={
                  processing || (!demoMode && !dropinInstance)
                }
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-55"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {processing ? (
                  <>
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Complete Purchase · ${total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[0.62rem] text-muted-foreground/35">
                By completing this purchase you agree to the terms outlined in
                each licensing contract.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <ConfirmationDialog
        open={showConfirm}
        title="Payment confirmed!"
        description="Your license contracts are ready. Download your files any time from My Account."
        confirmLabel="View My Account"
        cancelLabel="Stay here"
        onConfirm={handleConfirmSuccess}
        onCancel={() => {
          clearCart()
          setShowConfirm(false)
          toast.success("Purchase complete!")
        }}
      />
    </div>
  )
}
