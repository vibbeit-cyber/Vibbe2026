import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"
import { router } from "expo-router"
import { api } from "../../services/api"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Email required")
      return
    }

    try {
      setLoading(true)

      await api.post("/auth/forgot-password", { email })

      router.push({
        pathname: "/otp",
        params: { email, mode: "reset" },
      })
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Server error"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleSendOtp}
        style={[styles.button, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Please wait..." : "Send OTP"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 14,
    color: "#FFF",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
})
