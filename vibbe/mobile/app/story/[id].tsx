import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { markStorySeen } from "../../services/story.service";

const { width, height } = Dimensions.get("window");
const STORY_DURATION = 15000; // 15 seconds

/* -------- MOCK STORY DATA -------- */
const USER_STORIES = [
  {
    id: "1",
    type: "video",
    uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
  },
];

export default function StoryViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [muted, setMuted] = useState(true);
  const [reply, setReply] = useState("");

  /* -------- VIDEO PLAYER -------- */
  const player = useVideoPlayer(USER_STORIES[0].uri, (player) => {
    player.loop = false;
    player.muted = muted;
    player.play();
  });

  /* -------- UPDATE MUTE STATE -------- */
  useEffect(() => {
    player.muted = muted;
  }, [muted]);

  /* -------- MARK STORY SEEN + AUTO CLOSE -------- */
  useEffect(() => {
    if (id) {
      markStorySeen(id);
    }

    const timer = setTimeout(() => {
      router.back();
    }, STORY_DURATION);

    return () => clearTimeout(timer);
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* STORY VIDEO */}
      <Pressable
        style={styles.videoWrapper}
        onPress={() => setMuted((m) => !m)}
      >
        <VideoView
          player={player}
          style={styles.video}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />

        {/* MUTE INDICATOR */}
        <View style={styles.muteBadge}>
          <Text style={styles.muteText}>
            {muted ? "Muted" : "Sound"}
          </Text>
        </View>
      </Pressable>

      {/* REPLY INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.replyBox}>
          <TextInput
            placeholder="Reply to story…"
            placeholderTextColor="#999"
            value={reply}
            onChangeText={setReply}
            style={styles.input}
          />
        </View>
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

  videoWrapper: {
    flex: 1,
  },

  video: {
    width,
    height,
  },

  muteBadge: {
    position: "absolute",
    top: 20,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  muteText: {
    color: "#fff",
    fontSize: 12,
  },

  replyBox: {
    borderTopWidth: 1,
    borderColor: "#222",
    padding: 12,
    backgroundColor: "#000",
  },

  input: {
    color: "#fff",
    fontSize: 16,
  },
});
