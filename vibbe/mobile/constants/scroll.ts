import { SharedValue } from "react-native-reanimated"

export let scrollY: SharedValue<number> | null = null

export const registerScroll = (value: SharedValue<number>) => {
  scrollY = value
}
