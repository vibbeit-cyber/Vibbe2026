import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useTheme } from "../context/ThemeContext";

/* ---------------- TYPES ---------------- */

export type Post = {
  id: string;
  caption: string;
  image: string;
  isAnonymous: boolean;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  username?: string;
  avatar?: string | null;
};

type Props = {
  post: Post;
  onLike?: (id: string) => void;
};

/* ---------------- COMPONENT ---------------- */

export default function PostCard({ post, onLike }: Props) {
  const { colors } = useTheme();

  const displayName = post.isAnonymous
    ? "Anonymous"
    : post.username ?? "User";

  const avatarUri = post.isAnonymous
    ? "https://i.pravatar.cc/100?img=65"
    : post.avatar ?? "https://i.pravatar.cc/100";

  const handleShare = async () => {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert("Sharing not available");
      return;
    }
    await Sharing.shareAsync(post.image);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />

        <View>
          <Text style={[styles.username, { color: colors.text }]}>
            {displayName}
          </Text>

          {post.isAnonymous && (
            <View style={[styles.badge, { backgroundColor: colors.card }]}>
              <Ionicons name="eye-off" size={12} color={colors.text} />
              <Text style={[styles.badgeText, { color: colors.text }]}>
                Anonymous
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* IMAGE */}
      <Image source={{ uri: post.image }} style={styles.image} />

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onLike?.(post.id)}>
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={22}
            color={post.isLiked ? "#ff375f" : colors.text}
          />
        </TouchableOpacity>

        <Text style={{ color: colors.text }}>{post.likesCount}</Text>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/post/[id]/comments",
              params: { id: post.id },
            })
          }
        >
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text style={{ color: colors.text }}>{post.commentsCount}</Text>

        <TouchableOpacity onPress={handleShare}>
          <Ionicons
            name="paper-plane-outline"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* CAPTION */}
      <Text style={[styles.caption, { color: colors.text }]}>
        <Text style={{ fontWeight: "700" }}>{displayName} </Text>
        {post.caption}
      </Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "700",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    marginLeft: 4,
  },
  image: {
    width: "100%",
    height: 420,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  caption: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});
