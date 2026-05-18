import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 border font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-primary/10 border-primary/30 text-foreground px-2 py-0.5 text-xs",
        tag:
          "rounded-full bg-brand-accent-2/10 border-brand-accent-2/25 text-brand-accent-3 px-2 py-[3px] text-[0.65rem] leading-none hover:border-brand-accent-2/50",
        discount:
          "rounded bg-brand-accent-hero/10 border-brand-accent-hero/35 text-brand-accent-hero px-2 py-0.5 text-[0.7rem]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
