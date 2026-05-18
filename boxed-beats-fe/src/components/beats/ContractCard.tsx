import type { Beat, BeatContract } from '@/types'
import { cn } from '@/lib/utils'
import { DiscountBadge } from '@/components/ui'
import { useCartStore } from '@/store/cartStore'
import { Clock, DownloadCloud, FileText, Music2, Radio, ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'
import Countdown from 'react-countdown'

interface ContractCardProps {
  contract: BeatContract
  beat: Pick<Beat, 'id' | 'title' | 'artUrl'>
  onViewPdf?: () => void
  className?: string
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 text-[0.72rem]">
      <Icon size={11} className="shrink-0 text-brand-accent-3/60" strokeWidth={2} />
      <span className="text-brand-text-muted/55">{label}</span>
      <span className="ml-auto font-mono text-brand-text/80">{value}</span>
    </div>
  )
}

export function ContractCard({ contract, beat, onViewPdf, className }: ContractCardProps) {
  const { addItem, removeItem, hasItem } = useCartStore()
  const inCart = hasItem(contract.id)

  const hasDiscount = !!contract.discount && !!contract.discountExpiresAt
  const effectivePrice = hasDiscount
    ? contract.price * (1 - contract.discount! / 100)
    : contract.price
  const isWavTrackout = contract.coverageType === 'wav+trackout'

  function handleCart() {
    if (inCart) {
      removeItem(contract.id)
    } else {
      addItem({ contract, beat })
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl',
        'border border-primary/14 bg-background/40',
        'shadow-[0_2px_16px_-4px_rgba(16,80,103,0.18)]',
        className,
      )}
    >
      {/* Top accent line per coverage type */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-[2px]',
          isWavTrackout
            ? 'bg-gradient-to-r from-transparent via-brand-accent-2/60 to-transparent'
            : 'bg-gradient-to-r from-transparent via-brand-accent-3/40 to-transparent',
        )}
      />

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Coverage badge + discount badge */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1',
              'text-[0.65rem] font-medium uppercase tracking-wider',
              isWavTrackout
                ? 'border border-brand-accent-2/30 bg-brand-accent-2/10 text-brand-accent-2'
                : 'border border-brand-accent-3/25 bg-brand-accent-3/8 text-brand-accent-3',
            )}
          >
            <Music2 size={9} strokeWidth={2.5} />
            {isWavTrackout ? 'WAV + Trackout' : 'WAV'}
          </span>
          {hasDiscount && <DiscountBadge percent={contract.discount!} />}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold text-brand-text">
            ${effectivePrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="font-mono text-sm text-brand-text-muted/40 line-through">
              ${contract.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Discount countdown */}
        {hasDiscount && contract.discountExpiresAt && (
          <div className="flex items-center gap-1.5 text-[0.68rem] text-brand-accent-hero/70">
            <Clock size={10} strokeWidth={2} />
            <Countdown
              date={new Date(contract.discountExpiresAt)}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) return <span>Offer expired</span>
                if (days > 0) return <span>Ends in {days}d {hours}h</span>
                return <span>Ends in {hours}h {minutes}m {seconds}s</span>
              }}
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-primary/10 bg-primary/4 px-3 py-2.5">
          <StatRow icon={Radio} label="Streams" value={contract.streams.toLocaleString()} />
          <StatRow
            icon={DownloadCloud}
            label="Downloads"
            value={contract.downloads.toLocaleString()}
          />
          <StatRow
            icon={Clock}
            label="License Term"
            value={`${contract.durationMonths} months`}
          />
        </div>
      </div>

      {/* Action row */}
      <div className="flex gap-2 border-t border-primary/10 p-3">
        {onViewPdf && (
          <button
            onClick={onViewPdf}
            className={cn(
              'inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg',
              'border border-primary/20 text-[0.72rem] text-brand-text-muted/60',
              'hover:border-primary/35 hover:bg-primary/8 hover:text-brand-text',
              'transition-all duration-150',
            )}
          >
            <FileText size={12} strokeWidth={1.8} />
            View PDF
          </button>
        )}

        <motion.button
          onClick={handleCart}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className={cn(
            'inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg',
            'text-[0.72rem] font-medium transition-all duration-150',
            inCart
              ? 'border border-brand-accent-hero/30 bg-brand-accent-hero/12 text-brand-accent-hero hover:bg-brand-accent-hero/20'
              : 'border border-transparent bg-brand-accent-hero text-white shadow-[0_0_12px_rgba(199,119,139,0.2)] hover:bg-brand-accent-hero/85',
          )}
        >
          <ShoppingCart size={12} strokeWidth={2} />
          {inCart ? 'In Cart' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  )
}
