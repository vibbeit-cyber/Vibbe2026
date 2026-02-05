import { View, Text, StyleSheet, Pressable } from "react-native"
import { useRouter } from "expo-router"

export default function TopNavBar() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>Vibbe</Text>

      {/* Right icons */}
      <View style={styles.actions}>
        <Pressable onPress={() => router.push("/compose")}>
          <Text style={styles.icon}>＋</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.icon}>♡</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.icon}>✉</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff"
  },
  logo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ff375f"
  },
  actions: {
    flexDirection: "row",
    gap: 16
  },
  icon: {
    fontSize: 22
  }
})
