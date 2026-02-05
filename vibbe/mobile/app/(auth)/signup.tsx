import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  // Frontend-only strong password check
  const isStrongPassword = (pwd: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  const handleSignup = async () => {
    if (!email || !displayName || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!isStrongPassword(password)) {
      Alert.alert(
        "Weak password",
        "Use at least 8 characters with uppercase, lowercase, number & symbol"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        email: email.trim().toLowerCase(),
        password,
        display_name: displayName.trim(),
      });

      console.log("REGISTER RESPONSE:", response.data);

      // OTP flow (UNCHANGED)
      router.push({
        pathname: "/otp",
        params: { email },
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Server error";

      const lower = message.toLowerCase();

      if (lower.includes("exist") || lower.includes("already")) {
        Alert.alert(
          "Account already exists",
          "This email is already registered. Please sign in."
        );
        return;
      }

      Alert.alert("Signup failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        style={styles.input}
      />

      {/* Display Name */}
      <TextInput
        placeholder=" Name"
        placeholderTextColor="#777"
        value={displayName}
        onChangeText={setDisplayName}
        textContentType="name"
        style={styles.input}
      />

      {/* Password */}
      <View style={styles.passwordWrap}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure}
          textContentType="password"
          autoComplete="password"
          style={styles.passwordInput}
        />

        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off" : "eye"}
            size={22}
            color="#AAA"
          />
        </TouchableOpacity>
      </View>

      {/* Continue */}
      <TouchableOpacity
        onPress={handleSignup}
        style={[styles.button, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Please wait..." : "Continue"}
        </Text>
      </TouchableOpacity>

      {/* Already have account */}
      <TouchableOpacity
        onPress={() => router.replace("/signin")}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.signinText}>
          I already have an account?{" "}
          <Text style={styles.signinLink}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 14,
    color: "#FFF",
    marginBottom: 16,
  },

  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: "#FFF",
  },

  button: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  signinText: {
    textAlign: "center",
    color: "#AAA",
    fontSize: 14,
  },

  signinLink: {
    color: "#FFF",
    fontWeight: "600",
  },
});
