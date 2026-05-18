import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { ChevronLeft, ChevronRight, FileX, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

const DEMO_PDF_PATHS = ['/mock/contract-standard.pdf', '/mock/contract-premium.pdf']

interface PdfViewerModalProps {
  open: boolean
  onClose: () => void
  pdfUrl?: string
  title?: string
}

export function PdfViewerModal({ open, onClose, pdfUrl, title }: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1.0)
  const isDemo = !pdfUrl || DEMO_PDF_PATHS.includes(pdfUrl)

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
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    setPage(1)
    setScale(1.0)
    setNumPages(0)
  }, [pdfUrl, open])

  const bumpScale = (delta: number) =>
    setScale((s) => Math.min(2.5, Math.max(0.5, +(s + delta).toFixed(2))))

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="pdf-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            key="pdf-modal"
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ type: 'spring', stiffness: 330, damping: 28 }}
            className={cn(
              'fixed left-1/2 top-1/2 z-60 -translate-x-1/2 -translate-y-1/2',
              'flex max-h-[90vh] w-[min(92vw,800px)] flex-col overflow-hidden rounded-2xl',
              'border border-primary/25 bg-card/96 backdrop-blur-xl',
              'shadow-[0_0_80px_-8px_rgba(16,80,103,0.55)]',
            )}
          >
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent-hero/45 to-transparent" />

            {/* Toolbar */}
            <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-primary/12 px-4">
              <h3 className="truncate font-heading text-sm font-bold text-brand-text">
                {title ?? 'Contract PDF'}
              </h3>

              <div className="flex items-center gap-1">
                {!isDemo && (
                  <>
                    <button
                      onClick={() => bumpScale(-0.25)}
                      disabled={scale <= 0.5}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-brand-text-muted/55 transition-colors hover:bg-primary/8 hover:text-brand-text disabled:opacity-30"
                    >
                      <ZoomOut size={13} strokeWidth={2} />
                    </button>
                    <span className="min-w-[3rem] text-center font-mono text-[0.68rem] text-brand-text-muted/50">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={() => bumpScale(0.25)}
                      disabled={scale >= 2.5}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-brand-text-muted/55 transition-colors hover:bg-primary/8 hover:text-brand-text disabled:opacity-30"
                    >
                      <ZoomIn size={13} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setScale(1.0)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-brand-text-muted/55 transition-colors hover:bg-primary/8 hover:text-brand-text"
                    >
                      <RotateCcw size={11} strokeWidth={2} />
                    </button>
                    <div className="mx-1.5 h-4 w-px bg-primary/20" />
                  </>
                )}

                {!isDemo && numPages > 1 && (
                  <>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-brand-text-muted/55 transition-colors hover:bg-primary/8 hover:text-brand-text disabled:opacity-30"
                    >
                      <ChevronLeft size={14} strokeWidth={2} />
                    </button>
                    <span className="font-mono text-[0.68rem] text-brand-text-muted/55">
                      {page} / {numPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(numPages, p + 1))}
                      disabled={page >= numPages}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-brand-text-muted/55 transition-colors hover:bg-primary/8 hover:text-brand-text disabled:opacity-30"
                    >
                      <ChevronRight size={14} strokeWidth={2} />
                    </button>
                    <div className="mx-1.5 h-4 w-px bg-primary/20" />
                  </>
                )}

                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-brand-text-muted/55 transition-colors hover:text-brand-text"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto">
              {isDemo ? (
                <DemoFallback />
              ) : (
                <div className="flex justify-center p-4">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                    loading={<Spinner />}
                    error={<DemoFallback />}
                  >
                    <Page
                      pageNumber={page}
                      scale={scale}
                      loading={<Spinner />}
                      className="shadow-lg"
                    />
                  </Document>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Spinner() {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent-3/30 border-t-brand-accent-3" />
    </div>
  )
}

function DemoFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/18 bg-primary/6 text-brand-accent-2/60">
        <FileX size={24} strokeWidth={1.5} />
      </div>

      <div>
        <p className="font-heading text-base font-bold text-brand-text">Contract PDF</p>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-brand-text-muted/55">
          This is a demo environment — the actual contract PDF would appear here for review before
          purchase.
        </p>
      </div>

      {/* Mock contract preview */}
      <div className="w-full max-w-md rounded-xl border border-primary/14 bg-primary/4 p-5 text-left">
        <h4 className="font-heading text-sm font-bold text-brand-text">
          Beat Licensing Agreement — Preview
        </h4>
        <div className="mt-3 space-y-2">
          {[
            'Non-exclusive licensing rights for commercial use',
            'Right to distribute on all major streaming platforms',
            'Credit requirement: "Prod. by [Producer Name]"',
            'No ownership transfer of master recording',
            'Resale or sub-licensing strictly prohibited',
          ].map((term, i) => (
            <div key={i} className="flex items-start gap-2 text-[0.72rem] text-brand-text-muted/60">
              <span className="mt-0.5 shrink-0 font-mono text-brand-accent-3/50">{i + 1}.</span>
              {term}
            </div>
          ))}
        </div>
        <p className="mt-4 text-[0.65rem] text-brand-text-muted/35">
          * Preview only. Full legal terms are in the downloadable PDF.
        </p>
      </div>
    </div>
  )
}
