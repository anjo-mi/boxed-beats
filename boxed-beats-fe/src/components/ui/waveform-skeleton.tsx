import { cn } from "@/lib/utils"

// Heights (0–100) shaped to look like a real audio waveform
const WAVEFORM_HEIGHTS = [
  10, 18, 30, 46, 60, 70, 78, 72, 60, 66, 80, 88, 76, 62, 52, 60, 74, 84, 70, 58,
  65, 78, 73, 56, 46, 58, 74, 86, 80, 64, 50, 42, 54, 70, 82, 90, 84, 68, 58, 72,
  85, 78, 62, 50, 56, 70, 76, 62, 46, 38, 30, 24, 28, 38, 46, 38, 28, 20, 14, 8,
]

interface WaveformSkeletonProps {
  className?: string
  barCount?: number
}

function WaveformSkeleton({
  className,
  barCount = WAVEFORM_HEIGHTS.length,
}: WaveformSkeletonProps) {
  const heights = WAVEFORM_HEIGHTS.slice(0, barCount)

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex w-full items-stretch gap-[1.5px] overflow-hidden",
        className
      )}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px] bg-brand-primary/25"
          style={{ transform: `scaleY(${h / 100})` }}
        />
      ))}

      {/* Shimmer scan overlay */}
      <div
        className="pointer-events-none absolute inset-0 animate-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(127,222,255,0.055) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Edge fade — prevents bars from hard-clipping at edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--background) 0%, transparent 6%, transparent 94%, var(--background) 100%)",
        }}
      />
    </div>
  )
}

export { WaveformSkeleton }
