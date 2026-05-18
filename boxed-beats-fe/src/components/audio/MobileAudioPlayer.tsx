import { Pause, Play, ShoppingCart, SkipBack, SkipForward } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { formatTime, useAudioPlayer } from 'wavesurf'
import { cn } from '@/lib/utils'
import { usePlayerStore } from '@/store/playerStore'
import { ShareButton } from '@/components/ui'

export function MobileAudioPlayer() {
  const { currentSong, isPlaying, currentTime, duration, togglePlay, seek } = useAudioPlayer()
  const { currentBeat } = usePlayerStore()

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-40',
            'h-[var(--bottom-bar-height)]',
            'border-t border-brand-primary/20 bg-background/92 backdrop-blur-xl',
            'shadow-[0_-4px_28px_-4px_rgba(16,80,103,0.28)]',
          )}
        >
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent-hero/30 to-transparent" />

          <div className="flex h-full items-center px-3">
            {/* Art + title */}
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              {currentBeat && (
                <img
                  src={currentBeat.artUrl}
                  alt={currentBeat.title}
                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="truncate font-heading text-[0.8rem] font-bold leading-tight text-brand-text">
                  {currentSong.title}
                </p>
                <p className="font-mono text-[0.6rem] text-brand-text-muted/40">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </p>
              </div>
            </div>

            {/* Playback controls — min 44px tap targets */}
            <div className="flex shrink-0 items-center">
              <button
                onClick={() => seek(Math.max(0, currentTime - 10))}
                aria-label="Skip back 10 seconds"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-brand-text-muted/55 transition-all active:scale-90 hover:text-brand-text"
              >
                <SkipBack size={18} strokeWidth={2} />
              </button>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                  'bg-brand-accent-hero text-white',
                  'shadow-[0_0_14px_rgba(199,119,139,0.3)]',
                  'transition-transform active:scale-90',
                )}
              >
                {isPlaying ? (
                  <Pause size={18} strokeWidth={2.5} />
                ) : (
                  <Play size={18} strokeWidth={2.5} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={() => seek(Math.min(duration || 0, currentTime + 10))}
                aria-label="Skip forward 10 seconds"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-brand-text-muted/55 transition-all active:scale-90 hover:text-brand-text"
              >
                <SkipForward size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Right actions */}
            <div className="flex flex-1 items-center justify-end gap-0.5">
              <ShareButton onClick={() => {}} size="sm" />

              <button
                aria-label="Add to cart"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-brand-text-muted/55 transition-all active:scale-90 hover:text-brand-accent-hero"
              >
                <ShoppingCart size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
