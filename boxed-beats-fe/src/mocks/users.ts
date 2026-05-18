import type { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'artist@example.com',
    role: 'user',
    createdAt: '2025-11-15T00:00:00Z',
    purchases: [
      {
        id: 'purchase-001',
        contractId: 'contract-001a',
        beatId: 'beat-001',
        beatTitle: 'Crimson Horizon',
        coverageType: 'wav',
        purchasedAt: '2026-01-10T00:00:00Z',
        downloadUrl: '/mock/crimson-horizon.wav',
      },
      {
        id: 'purchase-002',
        contractId: 'contract-003b',
        beatId: 'beat-003',
        beatTitle: 'Solar Gate',
        coverageType: 'wav+trackout',
        purchasedAt: '2026-02-14T00:00:00Z',
        downloadUrl: '/mock/solar-gate.wav',
      },
      {
        id: 'purchase-003',
        contractId: 'contract-004a',
        beatId: 'beat-004',
        beatTitle: 'Void Walker',
        coverageType: 'wav',
        purchasedAt: '2026-03-22T00:00:00Z',
        downloadUrl: '/mock/void-walker.wav',
      },
    ],
  },
  {
    id: 'user-002',
    email: 'producer2@example.com',
    role: 'user',
    createdAt: '2026-01-03T00:00:00Z',
    purchases: [
      {
        id: 'purchase-004',
        contractId: 'contract-002a',
        beatId: 'beat-002',
        beatTitle: 'Neon Drift',
        coverageType: 'wav',
        purchasedAt: '2026-04-05T00:00:00Z',
        downloadUrl: '/mock/neon-drift.wav',
      },
      {
        id: 'purchase-005',
        contractId: 'contract-001b',
        beatId: 'beat-001',
        beatTitle: 'Crimson Horizon',
        coverageType: 'wav+trackout',
        purchasedAt: '2026-05-01T00:00:00Z',
        downloadUrl: '/mock/crimson-horizon.wav',
      },
    ],
  },
  {
    id: 'admin-001',
    email: 'admin@boxedbeats.com',
    role: 'admin',
    createdAt: '2025-10-01T00:00:00Z',
    purchases: [],
  },
]
