export type UserRole = 'guest' | 'user' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: string
  purchases: PurchasedContract[]
}

export interface PurchasedContract {
  id: string
  contractId: string
  beatId: string
  beatTitle: string
  coverageType: 'wav' | 'wav+trackout'
  purchasedAt: string
  downloadUrl?: string
}
