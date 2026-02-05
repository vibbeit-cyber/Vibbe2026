import { api } from "./api";

/* ================= TYPES ================= */

export type ReelResponse = {
  id: string;
  video_url: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: number;
  is_liked: boolean;
};

/* ================= GET REELS ================= */

export const getReels = async (): Promise<ReelResponse[]> => {
  try {
    const res = await api.get("/reels");
    return res.data.reels;
  } catch (error) {
    console.log("getReels error:", error);
    return [];
  }
};

/* ================= VIEW ================= */

export const addReelView = async (reelId: string) => {
  try {
    await api.post(`/reels/${reelId}/view`);
  } catch (error) {
    console.log("addReelView error:", error);
  }
};

/* ================= LIKE ================= */

export const likeReel = async (reelId: string) => {
  try {
    await api.post(`/reels/${reelId}/like`);
  } catch (error) {
    console.log("likeReel error:", error);
  }
};

/* ================= UNLIKE ================= */

export const unlikeReel = async (reelId: string) => {
  try {
    await api.delete(`/reels/${reelId}/like`);
  } catch (error) {
    console.log("unlikeReel error:", error);
  }
};
