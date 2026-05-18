import { useCallback, useState } from "react"
import { useDropzone, type Accept } from "react-dropzone"
import { AnimatePresence, motion } from "motion/react"
import {
  Archive,
  CheckCircle2,
  FileMusic,
  FileText,
  Image,
  UploadCloud,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type FileDropzoneType = "image" | "mp3" | "wav" | "zip" | "pdf"

const ACCEPT_MAP: Record<FileDropzoneType, Accept> = {
  image: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
  mp3: { "audio/mpeg": [".mp3"] },
  wav: { "audio/wav": [".wav"], "audio/x-wav": [".wav"] },
  zip: { "application/zip": [".zip"] },
  pdf: { "application/pdf": [".pdf"] },
}

const TYPE_ICON: Record<FileDropzoneType, React.ReactNode> = {
  image: <Image size={20} strokeWidth={1.4} />,
  mp3: <FileMusic size={20} strokeWidth={1.4} />,
  wav: <FileMusic size={20} strokeWidth={1.4} />,
  zip: <Archive size={20} strokeWidth={1.4} />,
  pdf: <FileText size={20} strokeWidth={1.4} />,
}

const TYPE_HINT: Record<FileDropzoneType, string> = {
  image: "JPG · PNG · WebP",
  mp3: "MP3",
  wav: "WAV",
  zip: "ZIP archive",
  pdf: "PDF document",
}

interface FileDropzoneProps {
  fileType: FileDropzoneType
  label: string
  value?: File | null
  onFileAccepted: (file: File) => void
  onClear?: () => void
  className?: string
  disabled?: boolean
}

function FileDropzone({
  fileType,
  label,
  value,
  onFileAccepted,
  onClear,
  className,
  disabled,
}: FileDropzoneProps) {
  const [progress, setProgress] = useState<number | null>(null)

  const simulateUpload = useCallback(
    (file: File) => {
      setProgress(0)
      let pct = 0
      const tick = setInterval(() => {
        pct += Math.random() * 32 + 8
        if (pct >= 100) {
          clearInterval(tick)
          setProgress(null)
          onFileAccepted(file)
        } else {
          setProgress(Math.min(Math.round(pct), 99))
        }
      }, 110)
    },
    [onFileAccepted],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT_MAP[fileType],
    maxFiles: 1,
    disabled: disabled || progress !== null,
    onDropAccepted: ([file]) => simulateUpload(file),
  })

  const hasFile = !!value
  const isLoading = progress !== null

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-brand-accent-3/75">
        {label}
      </span>

      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[6.5rem] flex-col items-center justify-center gap-2",
          "rounded-xl border-2 border-dashed px-3 py-4 text-center",
          "cursor-pointer select-none outline-none transition-all duration-200",
          isDragActive
            ? "border-brand-accent-hero/55 bg-brand-accent-hero/6"
            : hasFile
              ? "border-primary/40 bg-primary/5 cursor-default"
              : isLoading
                ? "border-primary/20 cursor-wait"
                : "border-primary/22 bg-background/25 hover:border-primary/40 hover:bg-primary/4",
          (disabled || isLoading) && "pointer-events-none",
          disabled && "opacity-50",
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex w-full flex-col items-center gap-2.5 px-2"
            >
              <UploadCloud size={19} className="text-brand-accent-3/50" />
              <div className="h-[3px] w-full max-w-24 overflow-hidden rounded-full bg-primary/15">
                <motion.div
                  className="h-full rounded-full bg-brand-accent-hero"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.12 }}
                />
              </div>
              <span className="font-mono text-[0.62rem] text-muted-foreground/60">
                {progress}%
              </span>
            </motion.div>
          ) : hasFile ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center gap-2 px-1"
            >
              <CheckCircle2
                size={14}
                className="shrink-0 text-brand-accent-3"
              />
              <span className="min-w-0 flex-1 truncate text-left text-xs font-medium text-brand-text">
                {value!.name}
              </span>
              {onClear && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClear()
                  }}
                  className="shrink-0 rounded p-0.5 text-muted-foreground/50 hover:text-brand-accent-hero transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  "transition-colors",
                  isDragActive
                    ? "text-brand-accent-hero"
                    : "text-muted-foreground/40",
                )}
              >
                {TYPE_ICON[fileType]}
              </span>
              <p className="text-[0.67rem] font-medium text-brand-text-muted/55">
                {isDragActive ? "Drop it!" : "Drag & drop or click"}
              </p>
              <p className="text-[0.6rem] text-muted-foreground/35">
                {TYPE_HINT[fileType]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export { FileDropzone }
export type { FileDropzoneProps }
