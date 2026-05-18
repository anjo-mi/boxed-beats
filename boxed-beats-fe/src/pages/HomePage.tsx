import { useState, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { Disc3 } from 'lucide-react'
import { MainAudioCard } from '@/components/audio'
import { SearchFilterBar, applyBeatFilter, DEFAULT_FILTER } from '@/components/filters'
import type { BeatFilterState } from '@/components/filters'
import { BeatsTable } from '@/components/tables'
import { ShareModal, ContractDetailModal } from '@/components/modals'
import { PaginationSentinel } from '@/components/ui'
import { mockBeats, mockContracts } from '@/mocks'
import { usePlayerStore } from '@/store/playerStore'
import type { Beat } from '@/types'

const PAGE_SIZE = 4

export default function HomePage() {
  const [filter, setFilter] = useState<BeatFilterState>(DEFAULT_FILTER)
  const [contractModalBeat, setContractModalBeat] = useState<Beat | null>(null)
  const [shareBeat, setShareBeat] = useState<Beat | null>(null)
  const { currentBeat } = usePlayerStore()

  const allTags = useMemo(
    () => [...new Set(mockBeats.flatMap((b) => b.tags))].sort(),
    [],
  )

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['beats', filter],
    queryFn: ({ pageParam, queryKey }) => {
      const [, currentFilter] = queryKey as ['beats', BeatFilterState]
      const filtered = applyBeatFilter(mockBeats, currentFilter)
      const start = pageParam * PAGE_SIZE
      return Promise.resolve({
        beats: filtered.slice(start, start + PAGE_SIZE),
        nextCursor: start + PAGE_SIZE < filtered.length ? pageParam + 1 : undefined,
        total: filtered.length,
      })
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })

  const allBeats = useMemo(() => data?.pages.flatMap((p) => p.beats) ?? [], [data])
  const totalCount = data?.pages[0]?.total ?? 0
  const isEndReached = !hasNextPage && allBeats.length > 0

  const beatContracts = useMemo(
    () =>
      contractModalBeat
        ? mockContracts.filter((c) => c.beatId === contractModalBeat.id)
        : [],
    [contractModalBeat],
  )

  return (
    <div className="min-h-screen">
      {/* ── Page header ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-primary/12 pt-[var(--navbar-height)]">
        {/* Atmospheric background layers */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/3 to-transparent" />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-[700px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(199,119,139,0.07) 0%, transparent 70%)',
          }}
        />
        {/* Faint diagonal lines for texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(127,222,255,1) 0px, rgba(127,222,255,1) 1px, transparent 1px, transparent 32px)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between gap-4"
          >
            {/* Brand identity */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(199,119,139,0.18) 0%, rgba(127,86,174,0.12) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(199,119,139,0.2)',
                  border: '1px solid rgba(199,119,139,0.2)',
                }}
              >
                <Disc3 size={19} strokeWidth={1.4} className="text-brand-accent-hero" />
              </div>
              <div>
                <p className="text-[0.57rem] font-semibold uppercase tracking-[0.22em] text-brand-accent-3/55">
                  The Catalog
                </p>
                <h1 className="font-heading text-xl font-bold leading-tight text-brand-text sm:text-2xl">
                  Boxed Beats
                </h1>
              </div>
            </div>

            {/* Track count pill */}
            <AnimatePresence>
              {totalCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/6 px-3 py-1.5"
                >
                  <span className="font-mono text-[0.65rem] tabular-nums text-muted-foreground/50">
                    {totalCount} {totalCount === 1 ? 'track' : 'tracks'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom accent edge */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-accent-hero/20 to-transparent" />
      </div>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
        {/* Main audio card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5"
        >
          <MainAudioCard
            onShare={() => currentBeat && setShareBeat(currentBeat)}
            onCartClick={() => currentBeat && setContractModalBeat(currentBeat)}
          />
        </motion.div>

        {/* Search / filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <SearchFilterBar
            value={filter}
            onChange={setFilter}
            availableTags={allTags}
          />
        </motion.div>

        {/* Beats table */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <BeatsTable
            beats={allBeats}
            contracts={mockContracts}
            mode="public"
            onCartClick={(beat) => setContractModalBeat(beat)}
            onShare={(beat) => setShareBeat(beat)}
          />
        </motion.div>

        {/* Pagination sentinel */}
        <PaginationSentinel
          onIntersect={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage()
          }}
          isLoading={isFetchingNextPage}
        />

        {/* End of catalog marker */}
        <AnimatePresence>
          {isEndReached && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center justify-center gap-4 py-6"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/15" />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground/25">
                end of catalog
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/15" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result count footer */}
        {totalCount > 0 && allBeats.length > 0 && (
          <p className="mt-1 text-center font-mono text-[0.62rem] text-muted-foreground/30">
            {allBeats.length} of {totalCount}
          </p>
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────────── */}
      {contractModalBeat && (
        <ContractDetailModal
          open={true}
          onClose={() => setContractModalBeat(null)}
          beat={contractModalBeat}
          contracts={beatContracts}
        />
      )}

      <ShareModal
        open={!!shareBeat}
        onClose={() => setShareBeat(null)}
        title={shareBeat?.title}
        url={
          typeof window !== 'undefined'
            ? `${window.location.origin}/?beat=${shareBeat?.id ?? ''}`
            : ''
        }
      />
    </div>
  )
}
