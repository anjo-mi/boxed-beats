import { Pause, Play, ShoppingCart, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { formatTime, useAudioPlayer } from 'wavesurf'
import { cn } from '@/lib/utils'
import { usePlayerStore } from '@/store/playerStore'
import { ShareButton } from '@/components/ui'

export function BottomBar() {
  const { currentSong, isPlaying, currentTime, duration, togglePlay, seek, setVolume, volume } =
    useAudioPlayer()
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
            'border-t border-brand-primary/20 bg-background/90 backdrop-blur-lg',
            'shadow-[0_-4px_28px_-4px_rgba(16,80,103,0.28)]',
          )}
        >
          {/* Top edge accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent-hero/25 to-transparent" />

          <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6">
            {/* Left — art + info */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {currentBeat && (
                <img
                  src={currentBeat.artUrl}
                  alt={currentBeat.title}
                  className="h-9 w-9 shrink-0 rounded-md object-cover opacity-90"
                />
              )}
              <div className="min-w-0">
                <p className="truncate font-heading text-[0.82rem] font-bold leading-tight text-brand-text">
                  {currentSong.title}
                </p>
                {currentBeat && (
                  <p className="font-mono text-[0.58rem] text-brand-text-muted/45">
                    {currentBeat.bpm} BPM
                  </p>
                )}
              </div>
            </div>

            {/* Center — playback controls + time */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => seek(Math.max(0, currentTime - 10))}
                aria-label="Skip back 10 seconds"
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-md',
                  'text-brand-text-muted/55 transition-colors hover:text-brand-text-muted',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                )}
              >
                <SkipBack size={13} strokeWidth={2} />
              </button>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  'bg-brand-accent-hero text-white',
                  'shadow-[0_0_12px_rgba(199,119,139,0.3)]',
                  'transition-all duration-200',
                  'hover:bg-brand-accent-hero/85 hover:shadow-[0_0_18px_rgba(199,119,139,0.45)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-hero/50',
                )}
              >
                {isPlaying ? (
                  <Pause size={13} strokeWidth={2.5} />
                ) : (
                  <Play size={13} strokeWidth={2.5} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={() => seek(Math.min(duration || 0, currentTime + 10))}
                aria-label="Skip forward 10 seconds"
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-md',
                  'text-brand-text-muted/55 transition-colors hover:text-brand-text-muted',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                )}
              >
                <SkipForward size={13} strokeWidth={2} />
              </button>

              <span className="ml-1 font-mono text-[0.6rem] text-brand-text-muted/40">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </span>
            </div>

            {/* Right — volume + actions */}
            <div className="flex flex-1 items-center justify-end gap-1.5">
              <div className="hidden items-center gap-1.5 sm:flex">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                  aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                  className="shrink-0 text-brand-text-muted/40 transition-colors hover:text-brand-text-muted"
                >
                  {volume === 0 ? (
                    <VolumeX size={12} strokeWidth={2} />
                  ) : (
                    <Volume2 size={12} strokeWidth={2} />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="Volume"
                  className="audio-range w-16 cursor-pointer"
                />
              </div>

              <ShareButton onClick={() => {}} size="sm" />

              <button
                aria-label="Add to cart"
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent',
                  'text-brand-text-muted/55 transition-all duration-150',
                  'hover:border-brand-accent-hero/30 hover:bg-brand-accent-hero/8 hover:text-brand-accent-hero',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                )}
              >
                <ShoppingCart size={14} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
