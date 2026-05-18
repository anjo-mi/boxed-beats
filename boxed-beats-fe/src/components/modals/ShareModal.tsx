import { useEffect, useState } from 'react'
import { Check, Link2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface ShareModalProps {
  open: boolean
  onClose: () => void
  url?: string
  title?: string
}

export function ShareModal({ open, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
    } catch {
      const el = document.getElementById('share-url-display') as HTMLInputElement | null
      el?.select()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="share-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/65 backdrop-blur-sm"
          />

          <motion.div
            key="share-modal"
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ type: 'spring', stiffness: 330, damping: 28 }}
            className={cn(
              'fixed left-1/2 top-1/2 z-60 -translate-x-1/2 -translate-y-1/2',
              'w-full max-w-sm overflow-hidden rounded-2xl',
              'border border-primary/25 bg-card/95 backdrop-blur-xl',
              'shadow-[0_0_60px_-10px_rgba(16,80,103,0.5)]',
              'p-6',
            )}
          >
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent-3/40 to-transparent" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground/50 transition-colors hover:text-brand-text"
            >
              <X size={13} />
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent-3/10 text-brand-accent-3">
                <Link2 size={17} strokeWidth={2} />
              </div>
              <h3 className="font-heading text-base font-bold text-brand-text">
                Share{title ? ` "${title}"` : ''}
              </h3>
              <p className="mt-1 text-xs text-brand-text-muted/55">
                Copy the link below to share this beat.
              </p>
            </div>

            {/* URL row */}
            <div className="flex gap-2">
              <div className="flex-1 overflow-hidden rounded-lg border border-primary/25 bg-primary/6 px-3 py-2">
                <p
                  id="share-url-display"
                  className="truncate font-mono text-[0.7rem] text-brand-text-muted/70"
                >
                  {shareUrl}
                </p>
              </div>

              <motion.button
                onClick={handleCopy}
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                className={cn(
                  'relative flex h-9 min-w-[80px] items-center justify-center gap-1.5 rounded-lg px-3',
                  'text-[0.72rem] font-medium transition-all duration-200',
                  copied
                    ? 'border border-emerald-400/30 bg-emerald-400/12 text-emerald-400'
                    : 'border border-transparent bg-brand-accent-3/18 text-brand-accent-3 hover:bg-brand-accent-3/25',
                )}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-1"
                    >
                      <Check size={11} strokeWidth={2.5} />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
