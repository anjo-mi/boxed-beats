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
    ],
  },
  {
    id: 'user-002',
    email: 'producer2@example.com',
    role: 'user',
    createdAt: '2026-01-03T00:00:00Z',
    purchases: [],
  },
  {
    id: 'admin-001',
    email: 'admin@boxedbeats.com',
    role: 'admin',
    createdAt: '2025-10-01T00:00:00Z',
    purchases: [],
  },
]
