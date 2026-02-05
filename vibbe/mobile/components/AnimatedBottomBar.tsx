import React, { useEffect } from "react"
import { View, Pressable, Text, StyleSheet, Dimensions } from "react-native"
import { useRouter, usePathname } from "expo-router"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"

const { width } = Dimensions.get("window")

const TABS = [
  { name: "home", label: "🏠" },
  { name: "reels", label: "🎬" },
  { name: "compose", label: "＋", center: true },
  { name: "messages", label: "💬" },
  { name: "profile", label: "👤" },
]

const TAB_WIDTH = width / TABS.length

export default function AnimatedBottomBar() {
  const router = useRouter()
  const pathname = usePathname()

  const translateX = useSharedValue(0)

  useEffect(() => {
    const index = TABS.findIndex(tab =>
      pathname.includes(tab.name)
    )
    if (index !== -1) {
      translateX.value = withSpring(index * TAB_WIDTH, {
        damping: 15,
        stiffness: 120,
      })
    }
  }, [pathname])

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {TABS.map((tab) => (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => {
              if (tab.name === "compose") {
                router.push("/compose")
              } else {
                router.replace((`/(tabs)/${tab.name}`) as any)
              }
            }}
          >
            <Text style={[styles.icon, tab.center && styles.plus]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
container: {
  flexDirection: "row",
  height: 70,
  width: "100%",
  backgroundColor: "transprancy",
},

  indicator: {
    position: "absolute",
    width: TAB_WIDTH,
    height: "100%",
    backgroundColor: "#ff375f",
    borderRadius: 40,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  icon: {
    fontSize: 22,
    color: "#444",
  },
  plus: {
    fontSize: 32,
    color: "#fff",
  },
})
