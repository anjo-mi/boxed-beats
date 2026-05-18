import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface TagPillProps {
  label: string
  className?: string
  onClick?: () => void
}

function TagPill({ label, className, onClick }: TagPillProps) {
  return (
    <Badge
      variant="tag"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "font-sans cursor-default",
        onClick && "cursor-pointer hover:bg-brand-accent-2/20",
        className
      )}
    >
      {label}
    </Badge>
  )
}

export { TagPill }
