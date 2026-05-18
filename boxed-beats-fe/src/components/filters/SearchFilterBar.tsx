import { Search, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { TagPill } from "@/components/ui/tag-pill"
import { cn } from "@/lib/utils"

export type SortOption =
  | "newest"
  | "oldest"
  | "bpm-asc"
  | "bpm-desc"
  | "price-asc"
  | "price-desc"
  | "title-asc"
  | "title-desc"

export interface BeatFilterState {
  query: string
  tags: string[]
  bpmMin: number | ""
  bpmMax: number | ""
  sortBy: SortOption
}

export const DEFAULT_FILTER: BeatFilterState = {
  query: "",
  tags: [],
  bpmMin: "",
  bpmMax: "",
  sortBy: "newest",
}

/** Apply filter state to a beat list (client-side). */
export function applyBeatFilter<
  T extends {
    title: string
    bpm: number
    tags: string[]
    createdAt: string
  },
>(beats: T[], filter: BeatFilterState): T[] {
  let result = beats

  if (filter.query.trim()) {
    const q = filter.query.toLowerCase()
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }

  if (filter.tags.length) {
    result = result.filter((b) =>
      filter.tags.every((ft) =>
        b.tags.some((t) => t.toLowerCase() === ft.toLowerCase()),
      ),
    )
  }

  if (filter.bpmMin !== "") {
    result = result.filter((b) => b.bpm >= (filter.bpmMin as number))
  }
  if (filter.bpmMax !== "") {
    result = result.filter((b) => b.bpm <= (filter.bpmMax as number))
  }

  switch (filter.sortBy) {
    case "newest":
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      break
    case "oldest":
      result = [...result].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      break
    case "bpm-asc":
      result = [...result].sort((a, b) => a.bpm - b.bpm)
      break
    case "bpm-desc":
      result = [...result].sort((a, b) => b.bpm - a.bpm)
      break
    case "title-asc":
      result = [...result].sort((a, b) => a.title.localeCompare(b.title))
      break
    case "title-desc":
      result = [...result].sort((a, b) => b.title.localeCompare(a.title))
      break
  }

  return result
}

interface SearchFilterBarProps {
  value: BeatFilterState
  onChange: (next: BeatFilterState) => void
  availableTags?: string[]
  className?: string
}

function SearchFilterBar({
  value,
  onChange,
  availableTags = [],
  className,
}: SearchFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const set = <K extends keyof BeatFilterState>(
    key: K,
    val: BeatFilterState[K],
  ) => onChange({ ...value, [key]: val })

  const toggleTag = (tag: string) => {
    const already = value.tags.includes(tag)
    set("tags", already ? value.tags.filter((t) => t !== tag) : [...value.tags, tag])
  }

  const clearAll = () => onChange(DEFAULT_FILTER)

  const isFiltered =
    value.query ||
    value.tags.length ||
    value.bpmMin !== "" ||
    value.bpmMax !== "" ||
    value.sortBy !== "newest"

  return (
    <div
      className={cn(
        "rounded-xl border border-primary/15 bg-background/30 backdrop-blur-sm",
        "overflow-hidden",
        className,
      )}
    >
      {/* Main bar */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/45"
          />
          <Input
            placeholder="Search beats, genres…"
            value={value.query}
            onChange={(e) => set("query", e.target.value)}
            className="h-8 pl-8 border-transparent bg-primary/6 focus:border-brand-accent-3/40 focus:bg-background"
          />
          {value.query && (
            <button
              type="button"
              onClick={() => set("query", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-brand-text transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Sort */}
        <Select
          value={value.sortBy}
          onChange={(e) => set("sortBy", e.target.value as SortOption)}
          className="h-8 w-40 shrink-0 border-transparent bg-primary/6 text-xs focus:border-brand-accent-3/40"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="bpm-asc">BPM ↑</option>
          <option value="bpm-desc">BPM ↓</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </Select>

        {/* Filters toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          aria-label="Toggle advanced filters"
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-150",
            showAdvanced
              ? "border-brand-accent-2/40 bg-brand-accent-2/10 text-brand-accent-2"
              : "border-primary/22 text-muted-foreground/55 hover:border-primary/40 hover:text-brand-text",
          )}
        >
          <SlidersHorizontal size={13} />
        </button>

        {/* Clear */}
        {isFiltered && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-primary/22 px-2.5 text-[0.7rem] text-muted-foreground/55 hover:border-brand-accent-hero/30 hover:text-brand-accent-hero transition-all"
          >
            <X size={11} />
            Clear
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="border-t border-primary/12 px-3 pb-3 pt-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
            {/* BPM range */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[0.62rem] font-semibold uppercase tracking-widest text-brand-accent-3/65">
                BPM Range
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min={40}
                  max={300}
                  value={value.bpmMin}
                  onChange={(e) =>
                    set("bpmMin", e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="h-7 w-20 border-transparent bg-primary/6 text-xs focus:border-brand-accent-3/40"
                />
                <span className="text-xs text-muted-foreground/40">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  min={40}
                  max={300}
                  value={value.bpmMax}
                  onChange={(e) =>
                    set("bpmMax", e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="h-7 w-20 border-transparent bg-primary/6 text-xs focus:border-brand-accent-3/40"
                />
              </div>
            </div>

            {/* Tag multiselect */}
            {availableTags.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[0.62rem] font-semibold uppercase tracking-widest text-brand-accent-3/65">
                  Genres / Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <TagPill
                      key={tag}
                      label={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "transition-all",
                        value.tags.includes(tag)
                          ? "border-brand-accent-2/55 bg-brand-accent-2/15 text-brand-accent-3"
                          : "opacity-60 hover:opacity-100",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { SearchFilterBar }
