import { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { Redirect, type Href } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const [target, setTarget] = useState<Href | null>(null);

  useEffect(() => {
    const init = async () => {
      // ✅ SecureStore DOES NOT work on web
      if (Platform.OS === "web") {
        setTarget("/(auth)/signin");
        return;
      }

      try {
        const token = await SecureStore.getItemAsync("token");

        if (token) {
          setTarget("/(tabs)/reels");
        } else {
          setTarget("/(auth)/signin");
        }
      } catch {
        setTarget("/(auth)/signin");
      }
    };

    init();
  }, []);

  if (!target) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return <Redirect href={target} />;
}
