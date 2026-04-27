import { useDisplayMode } from "@/store/useDisplayMode"

export function useSpacing() {
  const { mode } = useDisplayMode()

  const isDense = mode === "dense"

  return {
    space: isDense ? 8 : 16,
    spaceSmall: isDense ? 4 : 8,
    text: isDense ? 14 : 16,
    radius: isDense ? 6 : 10
  }
}