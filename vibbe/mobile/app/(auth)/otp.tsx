import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";

export default function OtpScreen() {
  const { email, mode } = useLocalSearchParams<{
    email: string;
    mode?: "reset";
  }>();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isResetMode = mode === "reset";

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "OTP required");
      return;
    }

    try {
      setLoading(true);

      // ✅ SIGNUP VERIFY FLOW
      if (!isResetMode) {
        await api.post("/auth/verify-otp", {
          email,
          otp,
        });

        Alert.alert("Success", "Account verified successfully");
        router.replace("/(auth)/signin");
        return;
      }

      // ✅ RESET PASSWORD FLOW
      if (!newPassword) {
        Alert.alert("Error", "New password required");
        return;
      }

      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword, // ✅ FIXED KEY
      });

      Alert.alert("Success", "Password reset successful");
      router.replace("/(auth)/signin");
    } catch (err: any) {
      console.log("OTP ERROR:", err?.response?.data);

      Alert.alert(
        "Error",
        err?.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);

      await api.post("/auth/resend-otp", { email });

      Alert.alert("OTP Sent", "A new OTP has been sent to your email");
    } catch {
      Alert.alert("Error", "Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {isResetMode ? "Reset Password" : "Verify OTP"}
      </Text>

      <Text style={styles.subtitle}>
        Enter the OTP sent to{" "}
        <Text style={{ color: "#FFF" }}>{email}</Text>
      </Text>

      {/* OTP INPUT */}
      <TextInput
        placeholder="Enter OTP"
        placeholderTextColor="#777"
        value={otp}
        onChangeText={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />

      {/* NEW PASSWORD (RESET MODE ONLY) */}
      {isResetMode && (
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#777"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>
        </View>
      )}

      {/* CONTINUE */}
      <TouchableOpacity
        onPress={handleVerifyOtp}
        style={[styles.button, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Please wait..." : "Continue"}
        </Text>
      </TouchableOpacity>

      {/* RESEND OTP */}
      <TouchableOpacity
        onPress={handleResendOtp}
        style={{ marginTop: 20 }}
        disabled={loading}
      >
        <Text style={styles.resend}>Didn’t receive OTP? Resend</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
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
    marginBottom: 10,
  },

  subtitle: {
    color: "#AAA",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 13,
  },

  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 14,
    color: "#FFF",
    marginBottom: 16,
  },

  passwordWrapper: {
    position: "relative",
  },

  eyeButton: {
    position: "absolute",
    right: 16,
    top: 18,
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

  resend: {
    textAlign: "center",
    color: "#AAA",
    fontSize: 14,
  },
});
