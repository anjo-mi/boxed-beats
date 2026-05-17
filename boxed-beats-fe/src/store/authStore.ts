import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole, User } from '@/types'
import { mockUsers } from '@/mocks'

interface AuthState {
  role: UserRole
  currentUser: User | null
  setRole: (role: UserRole) => void
  signIn: (email: string) => boolean
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: 'guest',
      currentUser: null,

      setRole: (role) => {
        const user = mockUsers.find((u) => u.role === role) ?? null
        set({ role, currentUser: user })
      },

      signIn: (email) => {
        const user = mockUsers.find((u) => u.email === email)
        if (!user) return false
        set({ role: user.role, currentUser: user })
        return true
      },

      signOut: () => set({ role: 'guest', currentUser: null }),
    }),
    { name: 'bb-auth' }
  )
)
