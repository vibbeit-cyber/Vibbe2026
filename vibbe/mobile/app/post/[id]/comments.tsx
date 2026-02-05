import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

type Comment = {
  id: string;
  text: string;
  isAnonymous: boolean;
  displayName: string;
};

/* MOCK DATA */
const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    text: "This really hit me.",
    isAnonymous: true,
    displayName: "Anonymous",
  },
  {
    id: "2",
    text: "Well said 👏",
    isAnonymous: false,
    displayName: "rocky",
  },
];

export default function CommentsScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();

  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      isAnonymous,
      displayName: isAnonymous ? "Anonymous" : "You",
    };

    setComments((prev) => [...prev, newComment]);
    setText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.name}>{item.displayName}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ANONYMOUS TOGGLE */}
        <View style={styles.toggleRow}>
          <Text>Comment anonymously</Text>
          <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
        </View>

        {/* INPUT */}
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Add a comment..."
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSend}>
            <Text style={styles.send}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  comment: {
    marginBottom: 12,
  },

  name: {
    fontWeight: "bold",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    marginRight: 12,
  },

  send: {
    fontWeight: "bold",
  },
});
