import { useEffect, useState } from 'react'
import { Music2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { TagPill } from '@/components/ui'
import { ContractCard } from '@/components/beats/ContractCard'
import { PdfViewerModal } from './PdfViewerModal'
import type { Beat, BeatContract } from '@/types'

interface ContractDetailModalProps {
  open: boolean
  onClose: () => void
  beat: Beat
  contracts: BeatContract[]
}

export function ContractDetailModal({ open, onClose, beat, contracts }: ContractDetailModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined)
  const [pdfTitle, setPdfTitle] = useState('')

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pdfUrl) {
          setPdfUrl(undefined)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, pdfUrl])

  function openPdf(contract: BeatContract) {
    const coverageLabel = contract.coverageType === 'wav+trackout' ? 'WAV + Trackout' : 'WAV'
    setPdfTitle(`${beat.title} — ${coverageLabel} License`)
    setPdfUrl(contract.pdfUrl)
  }

  const beatForCart = { id: beat.id, title: beat.title, artUrl: beat.artUrl }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="contract-detail-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              key="contract-detail-modal"
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ type: 'spring', stiffness: 330, damping: 28 }}
              className={cn(
                'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
                'flex max-h-[88vh] w-[min(92vw,700px)] flex-col overflow-hidden rounded-2xl',
                'border border-primary/25 bg-card/96 backdrop-blur-xl',
                'shadow-[0_0_80px_-8px_rgba(16,80,103,0.55)]',
              )}
            >
              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent-2/50 to-transparent" />

              {/* Beat header */}
              <div className="flex shrink-0 items-center gap-4 border-b border-primary/12 p-5">
                <div className="relative shrink-0">
                  <img
                    src={beat.artUrl}
                    alt={beat.title}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-brand-accent-hero/20" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Music2 size={10} strokeWidth={2} className="shrink-0 text-brand-accent-3/60" />
                    <span className="text-[0.62rem] uppercase tracking-widest text-brand-accent-3/60">
                      Choose a License
                    </span>
                  </div>
                  <h2 className="mt-0.5 truncate font-heading text-lg font-bold text-brand-text">
                    {beat.title}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[0.65rem] text-brand-text-muted/45">
                      {beat.bpm} BPM
                    </span>
                    {beat.tags.slice(0, 3).map((tag) => (
                      <TagPill key={tag} label={tag} />
                    ))}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-brand-text-muted/50 transition-colors hover:text-brand-text"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Contracts grid */}
              <div className="flex-1 overflow-y-auto p-5">
                {contracts.length === 0 ? (
                  <div className="py-12 text-center text-sm text-brand-text-muted/40">
                    No contracts available for this beat yet.
                  </div>
                ) : (
                  <div
                    className={cn(
                      'grid gap-3',
                      contracts.length === 1
                        ? 'grid-cols-1 max-w-xs mx-auto'
                        : 'grid-cols-1 sm:grid-cols-2',
                    )}
                  >
                    {contracts.map((contract, i) => (
                      <motion.div
                        key={contract.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <ContractCard
                          contract={contract}
                          beat={beatForCart}
                          onViewPdf={() => openPdf(contract)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PDF viewer stacks above with higher z-index */}
      <PdfViewerModal
        open={!!pdfUrl}
        onClose={() => setPdfUrl(undefined)}
        pdfUrl={pdfUrl}
        title={pdfTitle}
      />
    </>
  )
}
