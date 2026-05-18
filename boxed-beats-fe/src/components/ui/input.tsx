import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-lg border bg-background/60 px-3 py-1",
        "border-primary/30 text-sm text-brand-text placeholder:text-muted-foreground/50",
        "transition-all duration-150 outline-none",
        "hover:border-primary/50",
        "focus:border-brand-accent-3/50 focus:ring-2 focus:ring-brand-accent-3/12 focus:bg-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-brand-text",
        // date input color fix
        "[&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:invert",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
