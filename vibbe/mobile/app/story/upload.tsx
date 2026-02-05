import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function StoryUpload() {
  const [image, setImage] = useState<string | null>(null);

  /* ---------- PICK FROM GALLERY ---------- */
  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /* ---------- OPEN CAMERA ---------- */
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /* ---------- POST STORY ---------- */
  const postStory = async () => {
    if (!image) return;

    // 🔥 BACKEND CALL WILL GO HERE LATER
    console.log("Uploading story:", image);

    Alert.alert("Story uploaded ✅");
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>

        {image && (
          <TouchableOpacity onPress={postStory}>
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* PREVIEW */}
      <View style={styles.preview}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Choose a photo</Text>
        )}
      </View>

      {/* ACTIONS */}
      {!image && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={openCamera}>
            <Ionicons name="camera" size={22} color="#fff" />
            <Text style={styles.actionText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={pickFromGallery}>
            <Ionicons name="images" size={22} color="#fff" />
            <Text style={styles.actionText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  postText: {
    color: "#0a84ff",
    fontSize: 16,
    fontWeight: "bold",
  },

  preview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  placeholder: {
    color: "#888",
    fontSize: 16,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  actions: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  actionBtn: {
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    marginTop: 6,
  },
});
