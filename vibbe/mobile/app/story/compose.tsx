import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ComposeScreen() {
  const params = useLocalSearchParams<{
    uri?: string;
    type?: "image" | "video";
  }>();

  const [caption, setCaption] = useState("");

  const isVideo = params.type === "video" && params.uri;

  /* -------- VIDEO PLAYER -------- */
  const player = isVideo
    ? useVideoPlayer(params.uri!, (player) => {
        player.loop = true;
        player.play();
      })
    : null;

  /* -------- CLEANUP -------- */
  useEffect(() => {
    return () => {
      player?.pause();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>New Post</Text>

        <TouchableOpacity>
          <Text style={styles.postBtn}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* MEDIA PREVIEW */}
      <View style={styles.preview}>
        {isVideo ? (
          <VideoView
            player={player!}
            style={styles.media}
            allowsFullscreen
          />
        ) : (
          <Image
            source={{ uri: params.uri }}
            style={styles.media}
          />
        )}
      </View>

      {/* CAPTION */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TextInput
          placeholder="Write a caption…"
          placeholderTextColor="#999"
          value={caption}
          onChangeText={setCaption}
          style={styles.input}
          multiline
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  postBtn: {
    color: "#0a84ff",
    fontSize: 16,
    fontWeight: "600",
  },

  preview: {
    flex: 1,
    backgroundColor: "#000",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  input: {
    minHeight: 80,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderTopWidth: 1,
    borderColor: "#222",
  },
});
