import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Video, ResizeMode } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  addReelView,
  likeReel,
  unlikeReel,
} from "../services/reel.service";

const { height, width } = Dimensions.get("window");

/* ================= TYPES ================= */

export type Reel = {
  id: string;
  videoUrl: string;
  userId: string;
  avatar: string;
  likes: number;
  isLiked: boolean;
};

/* ================= COMPONENT ================= */

export default function ReelItem({
  reel,
  isActive,
}: {
  reel: Reel;
  isActive: boolean;
}) {
  const videoRef = useRef<Video>(null);
  const insets = useSafeAreaInsets();

  /* ================= FIXED SECTIONS ================= */

  const TOP_SECTION_HEIGHT = insets.top + 56;
  const BOTTOM_SECTION_HEIGHT = 120;
  const CONTAINER_WIDTH = width * 0.9;
  const IDEAL_VIDEO_HEIGHT = CONTAINER_WIDTH * (16 / 9);

  const VIDEO_SECTION_HEIGHT = Math.min(
    IDEAL_VIDEO_HEIGHT,
    height - TOP_SECTION_HEIGHT - BOTTOM_SECTION_HEIGHT
  );

  /* 🔊 MUTE */
  const [muted, setMuted] = useState(true);

  /* ❤️ LIKE STATE */
  const [liked, setLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likes);

  /* 👁️ VIEW GUARD */
  const viewedRef = useRef(false);

  /* ▶️ AUTO PLAY / PAUSE + VIEW COUNT */
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.playAsync();

      if (!viewedRef.current) {
        addReelView(reel.id);
        viewedRef.current = true;
      }
    } else {
      videoRef.current.pauseAsync();
    }
  }, [isActive]);

  /* ❤️ DOUBLE TAP HEART */
  const scale = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const showHeart = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ❤️ LIKE HANDLER (DOUBLE TAP + BUTTON) */
  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      setLikesCount((p) => p - 1);
      try {
        await unlikeReel(reel.id);
      } catch {
        setLiked(true);
        setLikesCount((p) => p + 1);
      }
    } else {
      setLiked(true);
      setLikesCount((p) => p + 1);
      try {
        await likeReel(reel.id);
      } catch {
        setLiked(false);
        setLikesCount((p) => p - 1);
      }
    }
  };

  /* 👆 TAP HANDLING */
  const handlePressIn = () => {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      showHeart();
      handleLike();
    } else {
      setMuted((prev) => !prev);
    }

    lastTap.current = now;
  };

  /* ⏩ HOLD → SPEED */
  const handleLongPress = async () => {
    await videoRef.current?.setRateAsync(2, true);
  };

  const handlePressOut = async () => {
    await videoRef.current?.setRateAsync(1, true);
  };

  return (
    <View style={styles.page}>
      {/* ================= TOP SECTION ================= */}
      <View style={[styles.topSection, { height: TOP_SECTION_HEIGHT }]}>
        <View style={styles.topBar}>
          <View style={styles.userInfo}>
            <Image source={{ uri: reel.avatar }} style={styles.avatar} />
            <Text style={styles.userId}>{reel.userId}</Text>
          </View>

          <View style={styles.topActions}>
            <View style={styles.followBtn}>
              <Text style={styles.followText}>Shadow</Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
          </View>
        </View>
      </View>

      {/* ================= VIDEO SECTION ================= */}
      <View style={[styles.videoSection, { height: VIDEO_SECTION_HEIGHT }]}>
        <Pressable
          onPressIn={handlePressIn}
          onLongPress={handleLongPress}
          onPressOut={handlePressOut}
          delayLongPress={200}
        >
          <View
            style={[
              styles.videoContainer,
              {
                width: CONTAINER_WIDTH,
                height: VIDEO_SECTION_HEIGHT,
              },
            ]}
          >
            <Video
              ref={videoRef}
              source={{ uri: reel.videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              isLooping
              isMuted={muted}
              useNativeControls={false}
            />

            {/* ❤️ HEART */}
            <Animated.View
              style={[styles.heart, { transform: [{ scale }] }]}
            >
              <Ionicons name="heart" size={90} color="#fff" />
            </Animated.View>

            {/* 🔇 MUTE ICON */}
            {muted && (
              <View style={styles.muteIcon}>
                <Ionicons name="volume-mute" size={18} color="#fff" />
              </View>
            )}
          </View>
        </Pressable>
      </View>

      {/* ================= BOTTOM SECTION ================= */}
      <View
        style={[styles.bottomSection, { height: BOTTOM_SECTION_HEIGHT }]}
      >
        <View style={styles.bottomActions}>
          <Ionicons name="chatbubble-outline" size={22} color="#fff" />

          <View style={styles.likeBox}>
            <Pressable onPress={handleLike}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={22}
                color={liked ? "#ff2d55" : "#fff"}
              />
            </Pressable>
            <Text style={styles.count}>{likesCount}</Text>
          </View>

          <Ionicons name="paper-plane-outline" size={22} color="#fff" />
        </View>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    height,
    width,
    backgroundColor: "#000",
  },

  topSection: {
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },

  userId: {
    color: "#fff",
    fontWeight: "600",
  },

  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  followText: {
    color: "#fff",
    fontSize: 12,
  },

  videoSection: {
    alignItems: "center",
    justifyContent: "center",
  },

  videoContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  heart: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
  },

  muteIcon: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },

  bottomSection: {
    alignItems: "center",
    justifyContent: "flex-start",
  },

  bottomActions: {
    flexDirection: "row",
    gap: 30,
    marginTop: 12,
  },

  likeBox: {
    alignItems: "center",
  },

  count: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
