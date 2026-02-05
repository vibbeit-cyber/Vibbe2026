import { Router } from "express"
import {
  createReel,
  getReelsFeed,
  incrementReelView,
  deleteReel,
} from "../controllers/reels.controller"
import { uploadReel } from "../middlewares/reelUpload"
import { requireAuth } from "../middlewares/auth.middleware"
import { toggleLike } from "../controllers/likes.controller"
import {
  addComment,
  getComments,
} from "../controllers/comments.controller"

const router = Router()

// Upload reel
router.post(
  "/",
  requireAuth,
  uploadReel.single("video"),
  createReel
)

// Get reels feed
router.get("/feed", getReelsFeed)

// Like / Unlike reel
router.post(
  "/:reelId/like",
  requireAuth,
  toggleLike
)

// Add comment
router.post(
  "/:reelId/comments",
  requireAuth,
  addComment
)

// Get comments
router.get(
  "/:reelId/comments",
  getComments
)

// Increment reel views
router.patch(
  "/:id/view",
  incrementReelView
)

// ✅ DELETE REEL (NOW IT WILL REGISTER)
router.delete(
  "/:id",
  requireAuth,
  deleteReel
)

export default router
