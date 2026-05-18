import { useState } from "react"
import { motion } from "motion/react"
import Countdown from "react-countdown"
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { EditButton } from "@/components/ui/action-icons"
import { DiscountBadge } from "@/components/ui/discount-badge"
import { cn } from "@/lib/utils"
import type { Beat, BeatContract } from "@/types"

type SortCol = "coverage" | "price" | "expiry"
type SortDir = "asc" | "desc"

interface ContractsTableProps {
  contracts: BeatContract[]
  beats: Beat[]
  onEdit: (contract: BeatContract) => void
  onDelete: (contract: BeatContract) => void
}

function formatNum(n: number) {
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}K`
      : String(n)
}

function SortBtn({
  col,
  sortCol,
  sortDir,
  onClick,
  children,
}: {
  col: SortCol
  sortCol: SortCol
  sortDir: SortDir
  onClick: (c: SortCol) => void
  children: React.ReactNode
}) {
  const active = sortCol === col
  return (
    <button
      type="button"
      onClick={() => onClick(col)}
      className={cn(
        "inline-flex items-center gap-1 transition-colors",
        active ? "text-brand-accent-3" : "hover:text-brand-text",
      )}
    >
      {children}
      {active ? (
        sortDir === "asc" ? (
          <ArrowUp size={10} />
        ) : (
          <ArrowDown size={10} />
        )
      ) : (
        <ArrowUpDown size={10} className="opacity-40" />
      )}
    </button>
  )
}

function ContractsTable({
  contracts,
  beats,
  onEdit,
  onDelete,
}: ContractsTableProps) {
  const [sortCol, setSortCol] = useState<SortCol>("price")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [deleteTarget, setDeleteTarget] = useState<BeatContract | null>(null)

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortCol(col)
      setSortDir("asc")
    }
  }

  const sorted = [...contracts].sort((a, b) => {
    let cmp = 0
    if (sortCol === "coverage") {
      cmp = a.coverageType.localeCompare(b.coverageType)
    } else if (sortCol === "price") {
      const aEff = a.discount ? a.price * (1 - a.discount / 100) : a.price
      const bEff = b.discount ? b.price * (1 - b.discount / 100) : b.price
      cmp = aEff - bEff
    } else if (sortCol === "expiry") {
      const aDate = a.discountExpiresAt
        ? new Date(a.discountExpiresAt).getTime()
        : Infinity
      const bDate = b.discountExpiresAt
        ? new Date(b.discountExpiresAt).getTime()
        : Infinity
      cmp = aDate - bDate
    }
    return sortDir === "asc" ? cmp : -cmp
  })

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-heading text-lg font-bold text-brand-text/35">
          No contracts yet
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground/45">
          Add a contract to link it to a beat.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-primary/14 bg-background/18">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-primary/18 bg-primary/4 hover:bg-primary/4">
              <TableHead>Beat</TableHead>
              <TableHead>
                <SortBtn
                  col="coverage"
                  sortCol={sortCol}
                  sortDir={sortDir}
                  onClick={handleSort}
                >
                  Coverage
                </SortBtn>
              </TableHead>
              <TableHead>
                <SortBtn
                  col="price"
                  sortCol={sortCol}
                  sortDir={sortDir}
                  onClick={handleSort}
                >
                  Price
                </SortBtn>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <SortBtn
                  col="expiry"
                  sortCol={sortCol}
                  sortDir={sortDir}
                  onClick={handleSort}
                >
                  Expires
                </SortBtn>
              </TableHead>
              <TableHead className="hidden md:table-cell text-right">
                Streams
              </TableHead>
              <TableHead className="hidden md:table-cell text-right">
                DLs
              </TableHead>
              <TableHead className="hidden lg:table-cell text-right">
                Duration
              </TableHead>
              <TableHead className="pr-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((contract, idx) => {
              const beat = beats.find((b) => b.id === contract.beatId)
              const effectivePrice = contract.discount
                ? contract.price * (1 - contract.discount / 100)
                : contract.price
              const hasExpiry = !!contract.discountExpiresAt

              return (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(idx * 0.04, 0.4),
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="border-b border-primary/10 transition-colors hover:bg-primary/4"
                >
                  {/* Beat name */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      {beat && (
                        <img
                          src={beat.artUrl}
                          alt={beat.title}
                          className="h-7 w-7 shrink-0 rounded-md object-cover opacity-80"
                        />
                      )}
                      <span className="text-sm font-medium text-brand-text">
                        {beat?.title ?? contract.beatId}
                      </span>
                    </div>
                  </TableCell>

                  {/* Coverage */}
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5",
                        "text-[0.62rem] font-semibold uppercase tracking-wide",
                        contract.coverageType === "wav+trackout"
                          ? "border-brand-accent-2/35 bg-brand-accent-2/8 text-brand-accent-2"
                          : "border-brand-accent-3/22 bg-brand-accent-3/5 text-brand-accent-3/75",
                      )}
                    >
                      {contract.coverageType === "wav+trackout"
                        ? "WAV + Trackout"
                        : "WAV"}
                    </span>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-sm font-semibold text-brand-text">
                        ${effectivePrice.toFixed(2)}
                      </span>
                      {contract.discount && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[0.58rem] text-muted-foreground/45 line-through">
                            ${contract.price.toFixed(2)}
                          </span>
                          <DiscountBadge percent={contract.discount} />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Expiry countdown */}
                  <TableCell className="hidden sm:table-cell">
                    {hasExpiry ? (
                      <Countdown
                        date={new Date(contract.discountExpiresAt!)}
                        renderer={({ days, hours, minutes, completed }) => {
                          if (completed) {
                            return (
                              <span className="text-xs text-muted-foreground/45">
                                Expired
                              </span>
                            )
                          }
                          const parts = [
                            days > 0 && `${days}d`,
                            hours > 0 && `${hours}h`,
                            `${minutes}m`,
                          ].filter(Boolean)
                          return (
                            <span className="font-mono text-xs text-brand-accent-hero/80">
                              {parts.join(" ")}
                            </span>
                          )
                        }}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground/35">—</span>
                    )}
                  </TableCell>

                  {/* Streams */}
                  <TableCell className="hidden text-right md:table-cell">
                    <span className="font-mono text-xs text-muted-foreground/70">
                      {formatNum(contract.streams)}
                    </span>
                  </TableCell>

                  {/* Downloads */}
                  <TableCell className="hidden text-right md:table-cell">
                    <span className="font-mono text-xs text-muted-foreground/70">
                      {formatNum(contract.downloads)}
                    </span>
                  </TableCell>

                  {/* Duration */}
                  <TableCell className="hidden text-right lg:table-cell">
                    <span className="font-mono text-xs text-muted-foreground/65">
                      {contract.durationMonths}mo
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <EditButton size="sm" onClick={() => onEdit(contract)} />
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(contract)}
                        aria-label="Delete contract"
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent",
                          "text-muted-foreground/45 transition-all duration-150",
                          "hover:border-destructive/30 hover:bg-destructive/8 hover:text-destructive",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        )}
                      >
                        <Trash2 size={13} strokeWidth={1.8} />
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete Contract"
        description="Are you sure you want to delete this contract? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget)
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

export { ContractsTable }
export type { ContractsTableProps }
