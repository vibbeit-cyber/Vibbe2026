import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HIGHLIGHTS = [
  {
    id: "h1",
    title: "Travel",
    cover: "https://picsum.photos/200",
  },
];

export default function HighlightsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={HIGHLIGHTS}
        keyExtractor={(i) => i.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.cover }} style={styles.image} />
            <Text style={styles.text}>{item.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  item: { flex: 1, alignItems: "center", margin: 10 },
  image: { width: 80, height: 80, borderRadius: 40 },
  text: { marginTop: 6, fontSize: 12 },
});
