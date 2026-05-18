import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"
import { Plus, Save, X } from "lucide-react"
import { FileDropzone } from "./FileDropzone"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { TagPill } from "@/components/ui/tag-pill"
import type { Beat } from "@/types"
import { cn } from "@/lib/utils"

export interface BeatFormValues {
  title: string
  bpm: number | ""
  tags: string[]
  artFile: File | null
  mp3File: File | null
  wavFile: File | null
  trackoutFile: File | null
}

interface BeatFormProps {
  initialValues?: Partial<Beat>
  onSave?: (values: BeatFormValues) => void
  className?: string
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-primary/14 bg-background/25 p-5">
      <h3 className="mb-4 text-[0.63rem] font-semibold uppercase tracking-widest text-brand-accent-3/75">
        {title}
      </h3>
      {children}
    </div>
  )
}

function BeatForm({ initialValues, onSave, className }: BeatFormProps) {
  const [values, setValues] = useState<BeatFormValues>({
    title: initialValues?.title ?? "",
    bpm: initialValues?.bpm ?? "",
    tags: initialValues?.tags ?? [],
    artFile: null,
    mp3File: null,
    wavFile: null,
    trackoutFile: null,
  })
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof BeatFormValues>(key: K, val: BeatFormValues[K]) =>
    setValues((p) => ({ ...p, [key]: val }))

  const addTag = useCallback(() => {
    const tag = tagInput.trim()
    if (!tag || values.tags.includes(tag)) {
      setTagInput("")
      return
    }
    set("tags", [...values.tags, tag])
    setTagInput("")
  }, [tagInput, values.tags])

  const removeTag = (tag: string) =>
    set("tags", values.tags.filter((t) => t !== tag))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.title.trim()) {
      toast.error("Beat title is required")
      return
    }
    if (!values.bpm) {
      toast.error("BPM is required")
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 750))
    setSaving(false)
    onSave?.(values)
    toast.success(initialValues?.id ? "Beat updated!" : "Beat saved!")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4", className)}
    >
      {/* Files */}
      <FormSection title="Files">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FileDropzone
            fileType="image"
            label="Beat Art"
            value={values.artFile}
            onFileAccepted={(f) => set("artFile", f)}
            onClear={() => set("artFile", null)}
          />
          <FileDropzone
            fileType="mp3"
            label="MP3"
            value={values.mp3File}
            onFileAccepted={(f) => set("mp3File", f)}
            onClear={() => set("mp3File", null)}
          />
          <FileDropzone
            fileType="wav"
            label="WAV"
            value={values.wavFile}
            onFileAccepted={(f) => set("wavFile", f)}
            onClear={() => set("wavFile", null)}
          />
          <FileDropzone
            fileType="zip"
            label="Trackout ZIP"
            value={values.trackoutFile}
            onFileAccepted={(f) => set("trackoutFile", f)}
            onClear={() => set("trackoutFile", null)}
          />
        </div>
      </FormSection>

      {/* Details */}
      <FormSection title="Details">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="beat-title">Title *</Label>
            <Input
              id="beat-title"
              placeholder="e.g. Crimson Horizon"
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="beat-bpm">BPM *</Label>
            <Input
              id="beat-bpm"
              type="number"
              placeholder="e.g. 140"
              min={40}
              max={300}
              value={values.bpm}
              onChange={(e) =>
                set("bpm", e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>
        </div>
      </FormSection>

      {/* Tags */}
      <FormSection title="Genres / Tags">
        <div className="mb-3 flex gap-2">
          <Input
            placeholder="Type a tag and press Enter…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTag()
              }
            }}
          />
          <button
            type="button"
            onClick={addTag}
            aria-label="Add tag"
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              "border border-primary/25 bg-primary/8 text-brand-accent-3",
              "hover:border-brand-accent-3/35 hover:bg-brand-accent-3/6",
              "transition-all duration-150",
            )}
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex min-h-8 flex-wrap gap-2">
          <AnimatePresence>
            {values.tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.14 }}
                className="inline-flex items-center gap-1"
              >
                <TagPill label={tag} />
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground/50 hover:text-brand-accent-hero transition-colors"
                >
                  <X size={10} strokeWidth={2.5} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          {values.tags.length === 0 && (
            <span className="text-xs text-muted-foreground/40">
              No tags added yet
            </span>
          )}
        </div>
      </FormSection>

      {/* Submit */}
      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          disabled={saving}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/80"
        >
          {saving ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
          ) : (
            <Save size={13} />
          )}
          {initialValues?.id ? "Update Beat" : "Save Beat"}
        </Button>
      </div>
    </form>
  )
}

export { BeatForm }
export type { BeatFormProps }
