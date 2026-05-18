import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { MainAudioCard } from "@/components/audio"
import { SearchFilterBar, applyBeatFilter, DEFAULT_FILTER } from "@/components/filters"
import type { BeatFilterState } from "@/components/filters"
import { BeatsTable } from "@/components/tables"
import { mockBeats, mockContracts } from "@/mocks"
import { routePaths } from "@/constants/routePaths"
import type { Beat } from "@/types"

export default function AdminBeatsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<BeatFilterState>(DEFAULT_FILTER)
  const [beats, setBeats] = useState(mockBeats)

  const allTags = [...new Set(mockBeats.flatMap((b) => b.tags))]
  const filtered = applyBeatFilter(beats, filter)

  const handleEdit = (beat: Beat) => {
    navigate({ to: routePaths.adminBeatEdit(beat.id) })
  }

  const handleDelete = (beat: Beat) => {
    setBeats((prev) => prev.filter((b) => b.id !== beat.id))
    toast.success(`"${beat.title}" deleted`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-[calc(var(--navbar-height)+2rem)] sm:px-6">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-text">
            Beats
          </h1>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Manage your beat catalog — play, edit, or remove.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: routePaths.adminBeatNew })}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <Plus size={14} />
          Add Beat
        </button>
      </div>

      {/* Audio card */}
      <div className="mb-5">
        <MainAudioCard />
      </div>

      {/* Filter bar */}
      <div className="mb-4">
        <SearchFilterBar
          value={filter}
          onChange={setFilter}
          availableTags={allTags}
        />
      </div>

      {/* Beats table */}
      <BeatsTable
        beats={filtered}
        contracts={mockContracts}
        mode="admin"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Result count */}
      {filtered.length > 0 && (
        <p className="mt-3 text-right text-xs text-muted-foreground/40">
          {filtered.length} of {beats.length} beats
        </p>
      )}
    </div>
  )
}
