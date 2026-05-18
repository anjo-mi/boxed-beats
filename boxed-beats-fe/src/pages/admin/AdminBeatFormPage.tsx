import { useNavigate, useLocation } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { BeatForm } from "@/components/forms"
import type { BeatFormValues } from "@/components/forms"
import { mockBeats } from "@/mocks"
import { routePaths } from "@/constants/routePaths"

function extractBeatId(pathname: string): string | undefined {
  const match = pathname.match(/\/admin\/beats\/([^/]+)\/edit/)
  return match?.[1]
}

export default function AdminBeatFormPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const beatId = extractBeatId(location.pathname)
  const isEditing = !!beatId
  const existingBeat = beatId ? mockBeats.find((b) => b.id === beatId) : undefined

  const handleSave = (_values: BeatFormValues) => {
    navigate({ to: routePaths.adminBeats })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-[calc(var(--navbar-height)+2rem)] sm:px-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate({ to: routePaths.adminBeats })}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-brand-text transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Beats
      </button>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-text">
          {isEditing ? "Edit Beat" : "Add Beat"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground/60">
          {isEditing
            ? `Editing "${existingBeat?.title ?? beatId}"`
            : "Upload a new beat to your catalog."}
        </p>
      </div>

      <BeatForm
        initialValues={existingBeat}
        onSave={handleSave}
      />
    </div>
  )
}
