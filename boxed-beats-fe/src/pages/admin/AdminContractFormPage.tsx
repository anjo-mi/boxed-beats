import { useNavigate, useLocation } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { ContractForm } from "@/components/forms"
import type { ContractFormValues } from "@/components/forms"
import { mockBeats, mockContracts } from "@/mocks"
import { routePaths } from "@/constants/routePaths"

function extractContractId(pathname: string): string | undefined {
  const match = pathname.match(/\/admin\/contracts\/([^/]+)\/edit/)
  return match?.[1]
}

export default function AdminContractFormPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const contractId = extractContractId(location.pathname)
  const isEditing = !!contractId
  const existing = contractId
    ? mockContracts.find((c) => c.id === contractId)
    : undefined

  const handleSave = (_values: ContractFormValues) => {
    navigate({ to: routePaths.adminContracts })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-[calc(var(--navbar-height)+2rem)] sm:px-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate({ to: routePaths.adminContracts })}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-brand-text transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Contracts
      </button>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-text">
          {isEditing ? "Edit Contract" : "Add Contract"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground/60">
          {isEditing
            ? "Update the terms and pricing for this contract."
            : "Create a new licensing contract and link it to a beat."}
        </p>
      </div>

      <ContractForm
        beats={mockBeats}
        initialValues={existing}
        onSave={handleSave}
      />
    </div>
  )
}
