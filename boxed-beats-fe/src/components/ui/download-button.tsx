import { ArrowDownToLine, Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

type DownloadState = "idle" | "downloading" | "done"

interface DownloadButtonProps {
  onDownload: () => Promise<void>
  label?: string
  className?: string
  disabled?: boolean
}

function DownloadButton({
  onDownload,
  label = "MP3",
  className,
  disabled,
}: DownloadButtonProps) {
  const [state, setState] = useState<DownloadState>("idle")

  const handleClick = async () => {
    if (state !== "idle" || disabled) return
    setState("downloading")
    try {
      await onDownload()
      setState("done")
      setTimeout(() => setState("idle"), 2200)
    } catch {
      setState("idle")
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "downloading" || disabled}
      aria-label={`Download ${label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1",
        "font-mono text-[0.7rem] transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        // idle
        state === "idle" &&
          "border-transparent text-brand-text-muted hover:border-brand-accent-3/40 hover:bg-brand-accent-3/5 hover:text-brand-accent-3",
        // downloading
        state === "downloading" &&
          "border-brand-accent-3/20 text-brand-accent-3",
        // done
        state === "done" &&
          "border-brand-accent-hero/25 text-brand-accent-hero",
        className
      )}
    >
      {state === "idle" && <ArrowDownToLine size={13} strokeWidth={2.2} />}
      {state === "downloading" && (
        <Loader2 size={13} strokeWidth={2.2} className="animate-spin" />
      )}
      {state === "done" && <Check size={13} strokeWidth={2.5} />}
      {label}
    </button>
  )
}

export { DownloadButton }
export type { DownloadState }
