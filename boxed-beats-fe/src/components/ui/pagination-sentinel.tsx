import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface PaginationSentinelProps {
  onIntersect: () => void
  isLoading?: boolean
  threshold?: number
  className?: string
}

export function PaginationSentinel({
  onIntersect,
  isLoading = false,
  threshold = 0.1,
  className,
}: PaginationSentinelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const onIntersectRef = useRef(onIntersect)
  onIntersectRef.current = onIntersect

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading) {
          onIntersectRef.current()
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isLoading, threshold])

  return (
    <div ref={ref} className={cn('flex items-center justify-center py-8', className)}>
      {isLoading && (
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-accent-3/25 border-t-brand-accent-3/70" />
          <span className="text-[0.68rem] text-brand-text-muted/40">Loading more beats…</span>
        </div>
      )}
    </div>
  )
}
