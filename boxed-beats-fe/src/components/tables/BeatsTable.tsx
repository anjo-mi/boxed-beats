import { useState } from "react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { BeatRow } from "@/components/beats/BeatRow"
import { useCartStore } from "@/store/cartStore"
import type { Beat, BeatContract } from "@/types"

interface BeatsTableProps {
  beats: Beat[]
  contracts?: BeatContract[]
  mode?: "public" | "admin"
  onEdit?: (beat: Beat) => void
  onDelete?: (beat: Beat) => void
  onCartClick?: (beat: Beat) => void
  onShare?: (beat: Beat) => void
}

function getCheapestContract(
  beatId: string,
  contracts: BeatContract[],
): BeatContract | null {
  const beatContracts = contracts.filter((c) => c.beatId === beatId)
  if (!beatContracts.length) return null
  return beatContracts.reduce((cheapest, c) => {
    const effectivePrice = c.discount
      ? c.price * (1 - c.discount / 100)
      : c.price
    const cheapestEffective = cheapest.discount
      ? cheapest.price * (1 - cheapest.discount / 100)
      : cheapest.price
    return effectivePrice < cheapestEffective ? c : cheapest
  })
}

function BeatsTable({
  beats,
  contracts = [],
  mode = "admin",
  onEdit,
  onDelete,
  onCartClick,
  onShare,
}: BeatsTableProps) {
  const { hasItem, addItem } = useCartStore()
  const [deleteTarget, setDeleteTarget] = useState<Beat | null>(null)

  if (beats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-heading text-lg font-bold text-brand-text/35">
          No beats found
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground/45">
          {mode === "admin"
            ? "Upload your first beat to get started."
            : "Try adjusting your search or filters."}
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
              <TableHead className="w-14 pl-3">Art</TableHead>
              <TableHead className="pl-2">Title / BPM</TableHead>
              <TableHead className="hidden sm:table-cell">Tags</TableHead>
              <TableHead className="hidden md:table-cell">Download</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="pr-3 text-right">
                {mode === "admin" ? "Actions" : ""}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beats.map((beat, idx) => {
              const cheapest = getCheapestContract(beat.id, contracts)
              const isInCart = cheapest ? hasItem(cheapest.id) : false

              return (
                <BeatRow
                  key={beat.id}
                  beat={beat}
                  index={idx}
                  mode={mode}
                  cheapestPrice={cheapest?.price}
                  cheapestContractId={cheapest?.id}
                  hasDiscount={!!cheapest?.discount}
                  discountPct={cheapest?.discount}
                  isInCart={isInCart}
                  onEdit={onEdit}
                  onDelete={
                    mode === "admin"
                      ? (b) => setDeleteTarget(b)
                      : undefined
                  }
                  onCartClick={onCartClick}
                  onShare={onShare}
                  onAddToCart={(b, contractId) => {
                    const contract = contracts.find((c) => c.id === contractId)
                    if (contract) {
                      addItem({
                        contract,
                        beat: { id: b.id, title: b.title, artUrl: b.artUrl },
                      })
                    }
                  }}
                />
              )
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete Beat"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) onDelete?.(deleteTarget)
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

export { BeatsTable }
export type { BeatsTableProps }
