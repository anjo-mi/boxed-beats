import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BeatContract, Beat } from '@/types'

export interface CartItem {
  contract: BeatContract
  beat: Pick<Beat, 'id' | 'title' | 'artUrl'>
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (contractId: string) => void
  clearCart: () => void
  hasItem: (contractId: string) => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (get().hasItem(item.contract.id)) return state
          return { items: [...state.items, item] }
        }),

      removeItem: (contractId) =>
        set((state) => ({
          items: state.items.filter((i) => i.contract.id !== contractId),
        })),

      clearCart: () => set({ items: [] }),

      hasItem: (contractId) => get().items.some((i) => i.contract.id === contractId),
    }),
    { name: 'bb-cart' }
  )
)
