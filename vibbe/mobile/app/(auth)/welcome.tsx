import { View, Text, Pressable, StyleSheet, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { useRouter } from "expo-router"

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* TITLE */}
      <Text style={styles.title}>
        Welcome to <Text style={styles.brand}>VIBBE</Text>
      </Text>

      {/* PRIMARY BUTTONS */}
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.pressed
          ]}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.primaryText}>Sign Up</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.pressed
          ]}
          onPress={() => router.push("/signin")}
        >
          <Text style={styles.primaryText}>Sign In</Text>
        </Pressable>
      </View>

      {/* DIVIDER */}
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      {/* GOOGLE */}
      <Pressable
        style={({ pressed }) => [
          styles.socialBtn,
          pressed && styles.pressed
        ]}
      >
        <Text style={styles.socialText}>
          <Text style={styles.google}>G</Text> Continue with Google
        </Text>
      </Pressable>

      {/* APPLE (iOS only) */}
      {Platform.OS === "ios" && (
        <Pressable
          style={({ pressed }) => [
            styles.socialBtn,
            pressed && styles.pressed
          ]}
        >
          <Text style={styles.socialText}>
            <Text style={styles.apple}></Text> Continue with Apple
          </Text>
        </Pressable>
      )}

      {/* FOOTER */}
      <Text style={styles.footer}>
        By signing up, you agree to our{" "}
        <Text style={styles.link}>Terms of Service</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    justifyContent: "center"
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 56
    ,
    color: "#FFF"
  },

  brand: {
    fontWeight: "800",
    color: "#FFF"
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 6
  },

  primaryText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: "#000"
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#333"
  },

  or: {
    marginHorizontal: 10,
    color: "#AAA",
    fontSize: 14
  },

  socialBtn: {
    backgroundColor: "#1C1C1C",
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 14
  },

  socialText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF"
  },

  google: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF"
  },

  apple: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF"
  },

  footer: {
    marginTop: 24,
    fontSize: 12,
    textAlign: "center",
    color: "#AAA"
  },

  link: {
    textDecorationLine: "underline",
    color: "#FFF"
  },

  pressed: {
    opacity: 0.7
  }
})
