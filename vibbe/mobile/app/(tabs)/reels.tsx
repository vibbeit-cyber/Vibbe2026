import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { useRef, useState } from "react";
import ReelItem, { Reel } from "../../components/ReelItem";

const { height } = Dimensions.get("window");
const ITEM_HEIGHT = height;

const REELS_DATA: Reel[] = [
  {
    id: "1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    userId: "User ID",
    avatar: "https://i.pravatar.cc/150?img=1",
    likes: 120,
  },
  {
    id: "2",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    userId: "User ID",
    avatar: "https://i.pravatar.cc/150?img=2",
    likes: 89,
  },
];

export default function ReelsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={REELS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelItem reel={item} isActive={index === activeIndex} />
        )}
        pagingEnabled
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
