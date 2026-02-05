import { View, Text, StyleSheet, Pressable } from "react-native"
import Avatar from "./Avatar"

type Post = {
  id: string
  authorName: string
  content: string
  anonymous: boolean
}

export default function FeedPost({ post }: { post: Post }) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <Avatar
        name={post.authorName}
        anonymous={post.anonymous}
      />

      {/* Content */}
      <Text style={styles.content}>
        {post.content}
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable><Text>❤️</Text></Pressable>
        <Pressable><Text>💬</Text></Pressable>
        <Pressable><Text>↗️</Text></Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  content: {
    marginTop: 8,
    fontSize: 15
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
    gap: 16
  }
})
