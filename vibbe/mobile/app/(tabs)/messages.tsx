import { View, Text, StyleSheet } from "react-native"

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Messages</Text>
      <Text style={styles.text}>Your chats will appear here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    color: "#666",
  },
})
