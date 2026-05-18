import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { ContractsTable } from "@/components/tables"
import { mockContracts, mockBeats } from "@/mocks"
import { routePaths } from "@/constants/routePaths"
import type { BeatContract } from "@/types"

export default function AdminContractsPage() {
  const navigate = useNavigate()
  const [contracts, setContracts] = useState(mockContracts)

  const handleEdit = (contract: BeatContract) => {
    navigate({ to: routePaths.adminContractEdit(contract.id) })
  }

  const handleDelete = (contract: BeatContract) => {
    setContracts((prev) => prev.filter((c) => c.id !== contract.id))
    toast.success("Contract deleted")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-[calc(var(--navbar-height)+2rem)] sm:px-6">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-text">
            Contracts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Manage licensing contracts linked to your beats.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: routePaths.adminContractNew })}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <Plus size={14} />
          Add Contract
        </button>
      </div>

      <ContractsTable
        contracts={contracts}
        beats={mockBeats}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {contracts.length > 0 && (
        <p className="mt-3 text-right text-xs text-muted-foreground/40">
          {contracts.length} contract{contracts.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
