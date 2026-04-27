import { create } from "zustand"

type Mode = "comfortable" | "dense"

type DisplayState = {
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useDisplayMode = create<DisplayState>((set) => ({
  mode: "dense",
  setMode: (mode) => set({ mode })
}))