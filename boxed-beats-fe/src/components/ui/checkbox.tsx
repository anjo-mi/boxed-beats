import { Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
}

function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  id,
  className,
}: CheckboxProps) {
  const [internal, setInternal] = useState(defaultChecked)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internal

  const toggle = () => {
    if (disabled) return
    const next = !isChecked
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      id={id}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        "inline-flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded",
        "border transition-all duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand-accent-3/25 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        isChecked
          ? "border-brand-accent-2 bg-brand-accent-2/18"
          : "border-primary/40 bg-background/60 hover:border-brand-accent-2/50",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {isChecked && (
        <Check size={10} strokeWidth={3} className="text-brand-accent-3" />
      )}
    </button>
  )
}

export { Checkbox }
export type { CheckboxProps }
