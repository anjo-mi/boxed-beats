export interface Beat {
  id: string
  title: string
  bpm: number
  tags: string[]
  artUrl: string
  mp3Url: string
  wavUrl: string
  trackoutUrl: string
  waveformPeaks: number[]
  createdAt: string
}

export interface BeatContract {
  id: string
  beatId: string
  coverageType: 'wav' | 'wav+trackout'
  price: number
  discount?: number
  discountExpiresAt?: string
  streams: number
  downloads: number
  durationMonths: number
  pdfUrl: string
}
