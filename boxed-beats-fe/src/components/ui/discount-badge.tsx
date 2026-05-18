import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface DiscountBadgeProps {
  percent: number
  className?: string
}

function DiscountBadge({ percent, className }: DiscountBadgeProps) {
  return (
    <Badge
      variant="discount"
      className={cn("font-mono tracking-tight", className)}
    >
      <span className="text-[0.6rem] leading-none opacity-80">↓</span>
      {percent}%&nbsp;OFF
    </Badge>
  )
}

export { DiscountBadge }
