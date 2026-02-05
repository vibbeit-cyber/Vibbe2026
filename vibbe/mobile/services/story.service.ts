// 🔐 Backend abstraction layer
import * as ImagePicker from "expo-image-picker";

type UploadStoryPayload = {
  file: ImagePicker.ImagePickerAsset;
  type: "image" | "video";
  caption?: string;
  isAnonymous: boolean;
};

export const uploadStory = async ({
  file,
  type,
  caption,
  isAnonymous,
}: UploadStoryPayload) => {
  // 🔒 Backend call will go here later
  console.log("Uploading story:", {
    uri: file.uri,
    type,
    caption,
    isAnonymous,
  });

  // simulate API delay
  await new Promise((res) => setTimeout(res, 1000));

  return { success: true };
};

export const markStorySeen = async (storyId?: string) => {
  if (!storyId) return;

  // POST /stories/seen
  console.log("Story seen:", storyId);
};

export const fetchStories = async () => {
  // GET /stories?active=true
  return [];
};
