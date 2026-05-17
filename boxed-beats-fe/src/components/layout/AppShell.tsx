import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Toaster } from 'sonner'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
