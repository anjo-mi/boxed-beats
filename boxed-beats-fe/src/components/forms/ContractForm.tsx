import { useState } from "react"
import { toast } from "sonner"
import { Calendar, DollarSign, Percent, Save } from "lucide-react"
import { FileDropzone } from "./FileDropzone"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { Beat, BeatContract } from "@/types"
import { cn } from "@/lib/utils"

export interface ContractFormValues {
  beatId: string
  coverageType: "wav" | "wav+trackout"
  price: number | ""
  discount: number | ""
  discountExpiresAt: string
  streams: number | ""
  downloads: number | ""
  durationMonths: number | ""
  pdfFile: File | null
}

interface ContractFormProps {
  beats: Beat[]
  initialValues?: Partial<BeatContract>
  onSave?: (values: ContractFormValues) => void
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

function ContractForm({
  beats,
  initialValues,
  onSave,
  className,
}: ContractFormProps) {
  const [values, setValues] = useState<ContractFormValues>({
    beatId: initialValues?.beatId ?? beats[0]?.id ?? "",
    coverageType: initialValues?.coverageType ?? "wav",
    price: initialValues?.price ?? "",
    discount: initialValues?.discount ?? "",
    discountExpiresAt: initialValues?.discountExpiresAt
      ? new Date(initialValues.discountExpiresAt).toISOString().split("T")[0]
      : "",
    streams: initialValues?.streams ?? "",
    downloads: initialValues?.downloads ?? "",
    durationMonths: initialValues?.durationMonths ?? "",
    pdfFile: null,
  })
  const [hasDiscount, setHasDiscount] = useState(!!initialValues?.discount)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof ContractFormValues>(
    key: K,
    val: ContractFormValues[K],
  ) => setValues((p) => ({ ...p, [key]: val }))

  const setNum = (
    key: "price" | "discount" | "streams" | "downloads" | "durationMonths",
    raw: string,
  ) => {
    setValues((p) => ({
      ...p,
      [key]: raw === "" ? "" : Number(raw),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.beatId) {
      toast.error("Select an associated beat")
      return
    }
    if (!values.price) {
      toast.error("Price is required")
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 750))
    setSaving(false)
    onSave?.(values)
    toast.success(initialValues?.id ? "Contract updated!" : "Contract saved!")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4", className)}
    >
      {/* Beat */}
      <FormSection title="Associated Beat">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contract-beat">Beat</Label>
          <Select
            id="contract-beat"
            value={values.beatId}
            onChange={(e) => set("beatId", e.target.value)}
          >
            {beats.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </Select>
        </div>
      </FormSection>

      {/* Coverage */}
      <FormSection title="Coverage Type">
        <div className="grid grid-cols-2 gap-3">
          {(["wav", "wav+trackout"] as const).map((type) => {
            const active = values.coverageType === type
            return (
              <label
                key={type}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-3",
                  "transition-all duration-150",
                  active
                    ? "border-brand-accent-2/40 bg-brand-accent-2/8"
                    : "border-primary/18 hover:border-primary/32",
                )}
              >
                <Checkbox
                  checked={active}
                  onCheckedChange={() => set("coverageType", type)}
                />
                <span className="text-sm font-medium text-brand-text">
                  {type === "wav" ? "WAV Only" : "WAV + Trackout"}
                </span>
              </label>
            )
          })}
        </div>
      </FormSection>

      {/* Pricing */}
      <FormSection title="Pricing">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Price (USD) *</Label>
            <div className="relative">
              <DollarSign
                size={12}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/45"
              />
              <Input
                id="price"
                type="number"
                placeholder="49.99"
                min={0}
                step={0.01}
                className="pl-7"
                value={values.price}
                onChange={(e) => setNum("price", e.target.value)}
              />
            </div>
          </div>

          {/* Discount */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="discount">Discount %</Label>
              <Checkbox
                checked={hasDiscount}
                onCheckedChange={(v) => {
                  setHasDiscount(v)
                  if (!v) {
                    set("discount", "")
                    set("discountExpiresAt", "")
                  }
                }}
              />
            </div>
            <div className="relative">
              <Percent
                size={12}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/45"
              />
              <Input
                id="discount"
                type="number"
                placeholder="10"
                min={1}
                max={99}
                disabled={!hasDiscount}
                className="pl-7"
                value={values.discount}
                onChange={(e) => setNum("discount", e.target.value)}
              />
            </div>
          </div>

          {/* Discount expiry */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="discount-exp">Discount Expires</Label>
            <div className="relative">
              <Calendar
                size={12}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/45"
              />
              <Input
                id="discount-exp"
                type="date"
                disabled={!hasDiscount}
                className="pl-7"
                value={values.discountExpiresAt}
                onChange={(e) => set("discountExpiresAt", e.target.value)}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration">Duration (months)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="12"
              min={1}
              max={120}
              value={values.durationMonths}
              onChange={(e) => setNum("durationMonths", e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      {/* Usage limits */}
      <FormSection title="Usage Limits">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="streams">Streams Allowed</Label>
            <Input
              id="streams"
              type="number"
              placeholder="500000"
              min={0}
              value={values.streams}
              onChange={(e) => setNum("streams", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="downloads">Downloads Allowed</Label>
            <Input
              id="downloads"
              type="number"
              placeholder="5000"
              min={0}
              value={values.downloads}
              onChange={(e) => setNum("downloads", e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      {/* PDF */}
      <FormSection title="Contract Document">
        <FileDropzone
          fileType="pdf"
          label="Contract PDF"
          value={values.pdfFile}
          onFileAccepted={(f) => set("pdfFile", f)}
          onClear={() => set("pdfFile", null)}
        />
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
          {initialValues?.id ? "Update Contract" : "Save Contract"}
        </Button>
      </div>
    </form>
  )
}

export { ContractForm }
export type { ContractFormProps }
