import { Pencil, Share2, ShoppingCart } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md"
}

function IconButton({ className, size = "md", ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-transparent",
        "text-brand-text-muted transition-all duration-150",
        "hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "h-7 w-7" : "h-8 w-8",
        className
      )}
      {...props}
    />
  )
}

// ── Share ─────────────────────────────────────────────────────────────────────

type ShareButtonProps = Omit<IconButtonProps, "children">

function ShareButton({ className, ...props }: ShareButtonProps) {
  return (
    <IconButton
      aria-label="Share"
      className={cn(
        "hover:border-brand-accent-3/40 hover:bg-brand-accent-3/5 hover:text-brand-accent-3",
        className
      )}
      {...props}
    >
      <Share2 size={15} strokeWidth={2} />
    </IconButton>
  )
}

// ── Edit ──────────────────────────────────────────────────────────────────────

type EditButtonProps = Omit<IconButtonProps, "children">

function EditButton({ className, ...props }: EditButtonProps) {
  return (
    <IconButton
      aria-label="Edit"
      className={cn(
        "hover:border-brand-accent-2/40 hover:bg-brand-accent-2/5 hover:text-brand-accent-2",
        className
      )}
      {...props}
    >
      <Pencil size={15} strokeWidth={2} />
    </IconButton>
  )
}

// ── Add to Cart ───────────────────────────────────────────────────────────────

interface AddToCartButtonProps extends Omit<IconButtonProps, "children" | "onClick"> {
  onAdd: () => void
  inCart?: boolean
}

function AddToCartButton({
  onAdd,
  inCart = false,
  className,
  ...props
}: AddToCartButtonProps) {
  const [bouncing, setBouncing] = useState(false)

  const handleClick = () => {
    if (bouncing) return
    setBouncing(true)
    onAdd()
    setTimeout(() => setBouncing(false), 500)
  }

  return (
    <IconButton
      onClick={handleClick}
      aria-label={inCart ? "Already in cart" : "Add to cart"}
      className={cn(
        inCart
          ? "border-brand-accent-hero/30 bg-brand-accent-hero/8 text-brand-accent-hero"
          : "hover:border-brand-accent-hero/40 hover:bg-brand-accent-hero/5 hover:text-brand-accent-hero",
        className
      )}
      {...props}
    >
      <motion.span
        animate={
          bouncing
            ? { scale: [1, 1.38, 0.88, 1.1, 0.97, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="inline-flex items-center justify-center"
      >
        <ShoppingCart size={15} strokeWidth={2} />
      </motion.span>
    </IconButton>
  )
}

export { ShareButton, EditButton, AddToCartButton }
export type { IconButtonProps }
