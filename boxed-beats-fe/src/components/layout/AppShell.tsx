import type { ReactNode } from 'react'
import { AudioPlayerProvider } from 'wavesurf'
import { Toaster } from 'sonner'
import { BottomBar, MobileAudioPlayer } from '@/components/audio'
import { Navbar } from './Navbar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AudioPlayerProvider
      config={{
        fadeInEnabled: true,
        fadeInDuration: 1200,
        persistVolume: true,
        storageKey: 'boxedbeats-volume',
        defaultVolume: 0.8,
      }}
    >
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pb-[var(--bottom-bar-height)]">{children}</main>
        {/* Desktop (sm+) uses full BottomBar with volume; mobile gets touch-optimised player */}
        <div className="hidden sm:block">
          <BottomBar />
        </div>
        <div className="sm:hidden">
          <MobileAudioPlayer />
        </div>
        <Toaster position="top-right" theme="dark" richColors />
      </div>
    </AudioPlayerProvider>
  )
}
