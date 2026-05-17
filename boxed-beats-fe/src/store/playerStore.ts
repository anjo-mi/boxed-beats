import { create } from 'zustand'
import type { Beat } from '@/types'

interface PlayerState {
  currentBeat: Beat | null
  isPlaying: boolean
  volume: number
  setCurrentBeat: (beat: Beat) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  togglePlay: () => void
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  currentBeat: null,
  isPlaying: false,
  volume: 0.8,

  setCurrentBeat: (beat) => set({ currentBeat: beat, isPlaying: true }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}))
