import { AnimatePresence, motion } from "motion/react"
import { AlertTriangle, X } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface ConfirmationDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
          />

          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 10 }}
            transition={{ type: "spring", stiffness: 330, damping: 28 }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "w-full max-w-sm overflow-hidden rounded-2xl",
              "border border-primary/25 bg-card/95 backdrop-blur-xl",
              "shadow-[0_0_60px_-10px_rgba(16,80,103,0.5)]",
              "p-6",
            )}
          >
            {/* Top edge glow line */}
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-px",
                variant === "destructive"
                  ? "bg-gradient-to-r from-transparent via-brand-accent-hero/55 to-transparent"
                  : "bg-gradient-to-r from-transparent via-brand-accent-3/30 to-transparent",
              )}
            />

            {/* Close */}
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground/50 hover:text-brand-text transition-colors"
            >
              <X size={13} />
            </button>

            {/* Icon */}
            <div
              className={cn(
                "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
                variant === "destructive"
                  ? "bg-brand-accent-hero/12 text-brand-accent-hero"
                  : "bg-primary/12 text-brand-accent-3",
              )}
            >
              <AlertTriangle size={17} strokeWidth={2} />
            </div>

            <h3 className="font-heading text-base font-bold text-brand-text">
              {title}
            </h3>

            {description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onCancel}
                className={cn(
                  "inline-flex h-8 items-center rounded-lg border px-3.5 text-sm",
                  "border-primary/25 text-brand-text-muted",
                  "hover:border-primary/40 hover:bg-primary/6 hover:text-brand-text",
                  "transition-all duration-150",
                )}
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm()
                }}
                className={cn(
                  "inline-flex h-8 items-center rounded-lg border px-3.5 text-sm font-medium",
                  "transition-all duration-150",
                  variant === "destructive"
                    ? "border-brand-accent-hero/30 bg-brand-accent-hero/12 text-brand-accent-hero hover:bg-brand-accent-hero/22"
                    : "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export { ConfirmationDialog }
export type { ConfirmationDialogProps }
