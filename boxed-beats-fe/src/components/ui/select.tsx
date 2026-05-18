import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        data-slot="select"
        className={cn(
          "flex h-9 w-full appearance-none rounded-lg border bg-background/60 px-3 pr-8 py-1",
          "border-primary/30 text-sm text-brand-text",
          "transition-all duration-150 outline-none cursor-pointer",
          "hover:border-primary/50",
          "focus:border-brand-accent-3/50 focus:ring-2 focus:ring-brand-accent-3/12",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&_option]:bg-card [&_option]:text-brand-text",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
      />
    </div>
  )
}

export { Select }
export type { SelectProps }
