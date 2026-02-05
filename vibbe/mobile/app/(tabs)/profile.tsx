import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <ThemeOption
          label="System"
          icon="settings-outline"
          active={mode === "system"}
          onPress={() => setMode("system")}
          colors={colors}
        />
        <ThemeOption
          label="Light"
          icon="sunny-outline"
          active={mode === "light"}
          onPress={() => setMode("light")}
          colors={colors}
        />
        <ThemeOption
          label="Dark"
          icon="moon-outline"
          active={mode === "dark"}
          onPress={() => setMode("dark")}
          colors={colors}
        />
      </View>
    </SafeAreaView>
  );
}

function ThemeOption({ label, icon, active, onPress, colors }: any) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.row}>
        <Ionicons name={icon} size={20} color={colors.text} />
        <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
      </View>
      {active && <Ionicons name="checkmark" size={20} color={colors.primary} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: { borderRadius: 12, padding: 12 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  text: { fontSize: 16 },
});
