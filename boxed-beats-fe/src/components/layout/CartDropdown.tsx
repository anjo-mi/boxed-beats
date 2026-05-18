import { Link } from '@tanstack/react-router'
import { ArrowRight, ShoppingCart, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { routePaths } from '@/constants/routePaths'
import { useCartStore } from '@/store/cartStore'

interface CartDropdownProps {
  count: number
}

export function CartDropdown({ count }: CartDropdownProps) {
  const [open, setOpen] = useState(false)
  const { items, removeItem } = useCartStore()
  const ref = useRef<HTMLDivElement>(null)

  // Click-outside to close
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const total = items.reduce((sum, { contract }) => {
    const price = contract.discount
      ? contract.price * (1 - contract.discount / 100)
      : contract.price
    return sum + price
  }, 0)

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Cart"
        aria-expanded={open}
        className={cn(
          'relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent',
          'text-brand-text-muted transition-all duration-150',
          'hover:border-brand-primary/30 hover:bg-brand-primary/10 hover:text-brand-text',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
          open && 'border-brand-primary/30 bg-brand-primary/10 text-brand-text',
        )}
      >
        <ShoppingCart size={16} strokeWidth={1.8} />

        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 480, damping: 20 }}
              className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand-accent-hero px-1 font-mono text-[9px] font-bold leading-none text-white"
            >
              {count > 9 ? '9+' : count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-brand-primary/20 bg-card shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-primary/15 px-4 py-3">
              <span className="font-heading text-sm font-bold text-brand-text">Cart</span>
              {count > 0 && (
                <span className="font-mono text-[0.65rem] text-brand-text-muted">
                  {count} item{count !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-10">
                <ShoppingCart
                  size={28}
                  strokeWidth={1.2}
                  className="text-brand-primary/25"
                />
                <p className="text-center font-sans text-xs leading-relaxed text-brand-text-muted/60">
                  Your cart is empty.
                  <br />
                  Add a license to get started.
                </p>
              </div>
            ) : (
              <>
                <ul className="max-h-56 divide-y divide-brand-primary/10 overflow-y-auto">
                  {items.map(({ contract, beat }) => {
                    const discountedPrice = contract.discount
                      ? contract.price * (1 - contract.discount / 100)
                      : contract.price

                    return (
                      <li
                        key={contract.id}
                        className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-brand-primary/5"
                      >
                        <img
                          src={beat.artUrl}
                          alt={beat.title}
                          className="h-9 w-9 shrink-0 rounded-md object-cover opacity-80"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-heading text-xs font-bold text-brand-text">
                            {beat.title}
                          </p>
                          <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-brand-text-muted/60">
                            {contract.coverageType === 'wav' ? 'WAV License' : 'WAV + Trackout'}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-0.5">
                          <span className="font-mono text-xs font-bold text-brand-accent-3">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {contract.discount && (
                            <span className="font-mono text-[0.58rem] text-brand-text-muted/40 line-through">
                              ${contract.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => removeItem(contract.id)}
                          aria-label={`Remove ${beat.title} from cart`}
                          className="ml-0.5 shrink-0 text-brand-text-muted/40 opacity-0 transition-all duration-150 hover:text-destructive group-hover:opacity-100"
                        >
                          <X size={13} strokeWidth={2} />
                        </button>
                      </li>
                    )
                  })}
                </ul>

                {/* Footer */}
                <div className="space-y-3 border-t border-brand-primary/15 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-brand-text-muted">Total</span>
                    <span className="font-mono text-base font-bold text-brand-text">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to={routePaths.checkout}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-lg',
                      'bg-brand-primary px-4 py-2.5 font-heading text-sm font-bold text-brand-text',
                      'transition-all duration-200 hover:bg-brand-primary/80',
                      'hover:shadow-[0_0_18px_rgba(16,80,103,0.45)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                    )}
                  >
                    Checkout
                    <ArrowRight size={14} strokeWidth={2.2} />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
