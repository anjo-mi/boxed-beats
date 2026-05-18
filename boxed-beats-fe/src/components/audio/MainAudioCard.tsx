import { Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'
import { WaveformPlayer, useAudioPlayer, formatTime } from 'wavesurf'
import { cn } from '@/lib/utils'
import { usePlayerStore } from '@/store/playerStore'
import { ShareButton, TagPill, WaveformSkeleton } from '@/components/ui'

const WAVEFORM_CONFIG = {
  waveColor: 'rgba(16, 80, 103, 0.4)',
  progressColor: '#c7778b',
  cursorColor: '#c7778b',
  barWidth: 2,
  barGap: 1,
  barRadius: 2,
  height: 72,
  normalize: true,
}

function EmptyCard() {
  return (
    <div
      className={cn(
        'flex items-center gap-5 rounded-2xl border border-brand-primary/15 px-5 py-4',
        'bg-card/30 backdrop-blur-sm',
        'shadow-[inset_0_1px_0_rgba(127,222,255,0.06)]',
      )}
    >
      <div
        className={cn(
          'flex h-24 w-24 shrink-0 items-center justify-center rounded-xl',
          'border border-brand-primary/20 bg-brand-primary/8',
        )}
      >
        <Music2 size={26} strokeWidth={1.2} className="text-brand-primary/35" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="space-y-2">
          <div className="h-5 w-44 animate-pulse rounded-md bg-brand-primary/12" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-14 animate-pulse rounded-md bg-brand-primary/10" />
            <div className="h-4 w-16 animate-pulse rounded-md bg-brand-primary/8" />
            <div className="h-4 w-16 animate-pulse rounded-md bg-brand-primary/8" />
          </div>
        </div>

        <WaveformSkeleton className="h-[72px]" />

        <div className="flex items-center gap-3">
          <div className="h-7 w-7 animate-pulse rounded-full bg-brand-primary/10" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-brand-primary/12" />
          <div className="h-7 w-7 animate-pulse rounded-full bg-brand-primary/10" />
          <div className="h-3.5 w-28 animate-pulse rounded-md bg-brand-primary/8" />
        </div>
      </div>
    </div>
  )
}

interface MainAudioCardProps {
  onShare?: () => void
  onCartClick?: () => void
}

export function MainAudioCard({ onShare, onCartClick }: MainAudioCardProps) {
  const { currentSong, isPlaying, currentTime, duration, play, togglePlay, seek, setVolume, volume } =
    useAudioPlayer()
  const { currentBeat } = usePlayerStore()

  if (!currentBeat) return <EmptyCard />

  const song = {
    id: currentBeat.id,
    title: currentBeat.title,
    audioUrl: currentBeat.mp3Url,
    peaks: currentBeat.waveformPeaks,
  }

  const handlePlayClick = () => {
    if (currentSong?.id === song.id) {
      togglePlay()
    } else {
      play(song)
    }
  }

  const handleVolumeToggle = () => setVolume(volume === 0 ? 0.8 : 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={cn(
        'flex items-stretch gap-5 rounded-2xl border border-brand-primary/20 px-5 py-4',
        'bg-card/40 backdrop-blur-sm',
        'shadow-[inset_0_1px_0_rgba(127,222,255,0.09)]',
      )}
    >
      {/* Album art */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
        <img
          src={currentBeat.artUrl}
          alt={currentBeat.title}
          className="h-full w-full object-cover"
        />
        {/* Inset ring — gives the art a subtle framed feel */}
        <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(199,119,139,0.2)]" />
      </div>

      {/* Right panel */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[1.05rem] font-bold leading-tight text-brand-text">
              {currentBeat.title}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[0.6rem] text-brand-text-muted/55">
                {currentBeat.bpm} BPM
              </span>
              {currentBeat.tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <ShareButton onClick={() => onShare?.()} />
            <button
              aria-label="Add to cart"
              onClick={() => onCartClick?.()}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent',
                'text-brand-text-muted transition-all duration-150',
                'hover:border-brand-accent-hero/35 hover:bg-brand-accent-hero/8 hover:text-brand-accent-hero',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              )}
            >
              <ShoppingCart size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Waveform */}
        <WaveformPlayer
          song={song}
          waveformConfig={WAVEFORM_CONFIG}
          showTime={false}
          lazyLoad={false}
          className="w-full"
        />

        {/* Controls row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => seek(Math.max(0, currentTime - 10))}
            aria-label="Skip back 10 seconds"
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md',
              'text-brand-text-muted/55 transition-colors hover:text-brand-text-muted',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            )}
          >
            <SkipBack size={14} strokeWidth={2} />
          </button>

          <button
            onClick={handlePlayClick}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
              'bg-brand-accent-hero text-white',
              'shadow-[0_0_14px_rgba(199,119,139,0.35)]',
              'transition-all duration-200',
              'hover:bg-brand-accent-hero/85 hover:shadow-[0_0_20px_rgba(199,119,139,0.5)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-hero/50',
            )}
          >
            {isPlaying ? (
              <Pause size={14} strokeWidth={2.5} />
            ) : (
              <Play size={14} strokeWidth={2.5} className="ml-0.5" />
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
            <SkipForward size={14} strokeWidth={2} />
          </button>

          <span className="font-mono text-[0.62rem] text-brand-text-muted/45">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </span>

          {/* Volume — pushed to the right */}
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={handleVolumeToggle}
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
              className="shrink-0 text-brand-text-muted/45 transition-colors hover:text-brand-text-muted"
            >
              {volume === 0 ? (
                <VolumeX size={13} strokeWidth={2} />
              ) : (
                <Volume2 size={13} strokeWidth={2} />
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
              className="audio-range w-20 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
