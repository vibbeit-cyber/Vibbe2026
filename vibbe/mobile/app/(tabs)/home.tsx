import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

import PostCard, { Post } from "../../components/PostCard"
import { useTheme } from "../../context/ThemeContext"

/* ---------------- MOCK STORIES ---------------- */

type Story = {
  id: string
  username: string
  avatar: string
  isAdd?: boolean
  anonymous?: boolean
}

const STORIES: Story[] = [
  {
    id: "me",
    username: "Your Story",
    avatar: "https://picsum.photos/seed/me/100",
    isAdd: true,
  },
  {
    id: "1",
    username: "anon",
    avatar: "https://picsum.photos/seed/anon/100",
    anonymous: true,
  },
  {
    id: "2",
    username: "rocky",
    avatar: "https://picsum.photos/seed/rocky/100",
  },
]

/* ---------------- MOCK POSTS ---------------- */

const POSTS: Post[] = [
  {
    id: "1",
    caption: "First Vibbe post 🔥",
    image: "https://picsum.photos/seed/post1/400/400",
    isAnonymous: true,
    likesCount: 12,
    commentsCount: 4,
    isLiked: false,
  },
]

/* ---------------- SCREEN ---------------- */

export default function HomeScreen() {
  const { colors } = useTheme()

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* HEADER */}
      <View style={[styles.header, { borderColor: colors.border }]}>
        <Text style={[styles.logo, { color: colors.text }]}>Vibbe</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: 16 }}>
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* STORIES */}
      <View style={[styles.storiesContainer, { borderColor: colors.border }]}>
        <FlatList
          data={STORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.story}
              onPress={() =>
                item.isAdd
                  ? router.push("/story/upload")
                  : router.push({
                      pathname: "/story/[id]",
                      params: { id: item.id },
                    })
              }
            >
              <View
                style={[
                  styles.storyRing,
                  {
                    borderColor: item.anonymous
                      ? colors.border
                      : colors.primary,
                  },
                ]}
              >
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.storyAvatar}
                />
              </View>

              <Text
                style={{ color: colors.text, fontSize: 12 }}
                numberOfLines={1}
              >
                {item.anonymous ? "Anonymous" : item.username}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* FEED */}
      <FlatList
        data={POSTS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100, // 🔥 REQUIRED FOR ANIMATED BOTTOM BAR
        }}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </SafeAreaView>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
  },

  logo: { fontSize: 22, fontWeight: "bold" },

  headerIcons: { flexDirection: "row" },

  storiesContainer: {
    height: 110,
    borderBottomWidth: 0.5,
    paddingVertical: 8,
  },

  story: { width: 80, alignItems: "center" },

  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
})
