import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { api } from "../../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const token = res.data?.token;

      if (!token) {
        Alert.alert("Login failed", "Invalid server response");
        return;
      }

      // ✅ SAME STORAGE AS OLD CODE (CRITICAL)
      await AsyncStorage.setItem("token", token);

      // ✅ GO TO MAIN APP
      router.replace("/reels");
    } catch (err: any) {
      const rawMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "";

      const message = rawMessage.toLowerCase();

      if (message.includes("password")) {
        Alert.alert(
          "Incorrect password",
          "The password you entered is incorrect."
        );
        return;
      }

      if (message.includes("not found") || message.includes("exist")) {
        Alert.alert(
          "Account not found",
          "No account found with this email. Please sign up."
        );
        return;
      }

      Alert.alert("Sign in failed", "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {/* Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
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

      {/* Forgot password */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/forgot-password",
            params: { email },
          })
        }
        style={{ alignSelf: "flex-end", marginBottom: 20 }}
      >
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Sign In */}
      <TouchableOpacity
        onPress={handleSignin}
        style={[styles.button, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {/* Signup redirect */}
      <TouchableOpacity
        onPress={() => router.replace("/signup")}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text style={styles.signupLink}>Sign Up</Text>
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
    marginBottom: 10,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: "#FFF",
  },

  forgot: {
    color: "#AAA",
    fontSize: 13,
  },

  button: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  signupText: {
    textAlign: "center",
    color: "#AAA",
    fontSize: 14,
  },

  signupLink: {
    color: "#FFF",
    fontWeight: "600",
  },
});
