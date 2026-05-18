import type { BeatContract } from '@/types'

export const mockContracts: BeatContract[] = [
  // Crimson Horizon (beat-001)
  {
    id: 'contract-001a',
    beatId: 'beat-001',
    coverageType: 'wav',
    price: 49.99,
    discount: 10,
    discountExpiresAt: '2026-06-01T00:00:00Z',
    streams: 500000,
    downloads: 5000,
    durationMonths: 12,
    pdfUrl: '/mock/contract-standard.pdf',
  },
  {
    id: 'contract-001b',
    beatId: 'beat-001',
    coverageType: 'wav+trackout',
    price: 99.99,
    streams: 1000000,
    downloads: 10000,
    durationMonths: 24,
    pdfUrl: '/mock/contract-premium.pdf',
  },

  // Neon Drift (beat-002)
  {
    id: 'contract-002a',
    beatId: 'beat-002',
    coverageType: 'wav',
    price: 39.99,
    streams: 250000,
    downloads: 2500,
    durationMonths: 12,
    pdfUrl: '/mock/contract-standard.pdf',
  },

  // Solar Gate (beat-003)
  {
    id: 'contract-003a',
    beatId: 'beat-003',
    coverageType: 'wav',
    price: 59.99,
    streams: 750000,
    downloads: 7500,
    durationMonths: 18,
    pdfUrl: '/mock/contract-standard.pdf',
  },
  {
    id: 'contract-003b',
    beatId: 'beat-003',
    coverageType: 'wav+trackout',
    price: 129.99,
    discount: 15,
    discountExpiresAt: '2026-05-30T00:00:00Z',
    streams: 2000000,
    downloads: 20000,
    durationMonths: 36,
    pdfUrl: '/mock/contract-premium.pdf',
  },

  // Void Walker (beat-004)
  {
    id: 'contract-004a',
    beatId: 'beat-004',
    coverageType: 'wav',
    price: 44.99,
    streams: 300000,
    downloads: 3000,
    durationMonths: 12,
    pdfUrl: '/mock/contract-standard.pdf',
  },
  {
    id: 'contract-004b',
    beatId: 'beat-004',
    coverageType: 'wav+trackout',
    price: 89.99,
    streams: 1000000,
    downloads: 10000,
    durationMonths: 24,
    pdfUrl: '/mock/contract-premium.pdf',
  },

  // Jade Ember (beat-005)
  {
    id: 'contract-005a',
    beatId: 'beat-005',
    coverageType: 'wav',
    price: 34.99,
    streams: 200000,
    downloads: 2000,
    durationMonths: 12,
    pdfUrl: '/mock/contract-standard.pdf',
  },
]
