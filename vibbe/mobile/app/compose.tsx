import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ComposeScreen() {
  const router = useRouter();
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>

        <Text style={styles.headerTitle}>Create Post</Text>

        <Pressable
          style={[
            styles.postBtnSmall,
            { opacity: text.trim() ? 1 : 0.5 },
          ]}
          disabled={!text.trim()}
          onPress={() => {
            // TODO: send post to backend
            router.back();
          }}
        >
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>

      {/* Input */}
      <TextInput
        placeholder="What's on your mind?"
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
        style={styles.input}
        multiline
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  postBtnSmall: {
    backgroundColor: "#ff375f",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  /* Input */
  input: {
    padding: 16,
    fontSize: 16,
    minHeight: 180,
    textAlignVertical: "top",
  },

  postText: {
    color: "#fff",
    fontWeight: "600",
  },
});
