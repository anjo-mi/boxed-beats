import { motion } from "motion/react"
import { Play, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useAudioPlayer } from "wavesurf"
import { cn } from "@/lib/utils"
import { usePlayerStore } from "@/store/playerStore"
import {
  TagPill,
  DownloadButton,
  ShareButton,
  EditButton,
  AddToCartButton,
  DiscountBadge,
} from "@/components/ui"
import type { Beat } from "@/types"

interface BeatRowProps {
  beat: Beat
  index?: number
  mode?: "public" | "admin"
  cheapestPrice?: number
  cheapestContractId?: string
  hasDiscount?: boolean
  discountPct?: number
  isInCart?: boolean
  onAddToCart?: (beat: Beat, contractId: string) => void
  onCartClick?: (beat: Beat) => void
  onEdit?: (beat: Beat) => void
  onDelete?: (beat: Beat) => void
  onShare?: (beat: Beat) => void
}

function BeatRow({
  beat,
  index = 0,
  mode = "public",
  cheapestPrice,
  cheapestContractId,
  hasDiscount = false,
  discountPct,
  isInCart = false,
  onAddToCart,
  onCartClick,
  onEdit,
  onDelete,
  onShare,
}: BeatRowProps) {
  const { currentBeat, setCurrentBeat } = usePlayerStore()
  const { play } = useAudioPlayer()
  const isSelected = currentBeat?.id === beat.id

  const handlePlay = () => {
    setCurrentBeat(beat)
    play({ id: beat.id, title: beat.title, audioUrl: beat.mp3Url, peaks: beat.waveformPeaks })
  }

  const handleDownload = async () => {
    await new Promise((r) => setTimeout(r, 600))
    toast.success(`Downloading ${beat.title} (MP3)`)
  }

  const displayTags = beat.tags.slice(0, 3)
  const extraCount = beat.tags.length - displayTags.length

  const discountedPrice =
    cheapestPrice != null && hasDiscount && discountPct
      ? cheapestPrice * (1 - discountPct / 100)
      : null

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.04, 0.4),
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={handlePlay}
      className={cn(
        "group cursor-pointer border-b transition-all duration-150",
        isSelected
          ? "border-brand-accent-hero/25 bg-brand-accent-hero/10 shadow-[inset_3px_0_0_rgba(199,119,139,0.5)]"
          : "border-primary/10 hover:bg-primary/8 hover:border-primary/20",
      )}
    >
      {/* Art thumbnail */}
      <td className="w-14 py-2.5 pl-3 pr-1">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
          <img
            src={beat.artUrl}
            alt={beat.title}
            className="h-full w-full object-cover"
          />
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 transition-opacity duration-150",
              isSelected
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100",
            )}
          >
            <Play size={11} fill="white" className="text-white ml-0.5" />
          </div>
          {isSelected && (
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_0_0_1.5px_rgba(199,119,139,0.55)]" />
          )}
        </div>
      </td>

      {/* Title / BPM */}
      <td className="min-w-[8rem] max-w-[14rem] py-2.5 pl-2 pr-4">
        <p className="truncate font-heading text-[0.875rem] font-bold leading-tight text-brand-text">
          {beat.title}
        </p>
        <p className="mt-0.5 font-mono text-[0.58rem] text-muted-foreground/55">
          {beat.bpm} BPM
        </p>
      </td>

      {/* Tags */}
      <td className="hidden py-2.5 px-2 sm:table-cell">
        <div className="flex flex-wrap items-center gap-1">
          {displayTags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
          {extraCount > 0 && (
            <span className="text-[0.58rem] text-muted-foreground/45">
              +{extraCount}
            </span>
          )}
        </div>
      </td>

      {/* MP3 download */}
      <td
        className="hidden py-2.5 px-2 md:table-cell"
        onClick={(e) => e.stopPropagation()}
      >
        <DownloadButton onDownload={handleDownload} label="MP3" />
      </td>

      {/* Price */}
      <td className="py-2.5 px-2 text-right">
        {cheapestPrice != null ? (
          <div className="flex flex-col items-end gap-0.5">
            {discountedPrice != null ? (
              <>
                <span className="font-mono text-sm font-semibold text-brand-text">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="font-mono text-[0.58rem] text-muted-foreground/45 line-through">
                  ${cheapestPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-mono text-sm font-semibold text-brand-text">
                from ${cheapestPrice.toFixed(2)}
              </span>
            )}
            {hasDiscount && discountPct != null && (
              <DiscountBadge percent={discountPct} />
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/35">—</span>
        )}
      </td>

      {/* Actions */}
      <td
        className="py-2.5 pl-2 pr-3 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-1">
          {mode === "public" ? (
            <>
              <ShareButton size="sm" onClick={() => onShare?.(beat)} />
              <AddToCartButton
                size="sm"
                inCart={isInCart}
                onAdd={() => {
                  if (onCartClick) {
                    onCartClick(beat)
                    return
                  }
                  if (cheapestContractId) {
                    onAddToCart?.(beat, cheapestContractId)
                    if (!isInCart)
                      toast.success(`${beat.title} added to cart`)
                  }
                }}
              />
            </>
          ) : (
            <>
              <EditButton size="sm" onClick={() => onEdit?.(beat)} />
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(beat)}
                  aria-label="Delete beat"
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent",
                    "text-muted-foreground/45 transition-all duration-150",
                    "hover:border-destructive/30 hover:bg-destructive/8 hover:text-destructive",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  )}
                >
                  <Trash2 size={13} strokeWidth={1.8} />
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </motion.tr>
  )
}

export { BeatRow }
export type { BeatRowProps }
