import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/reels")
  },
  filename: (_req, file, cb) => {
    const uniqueName =
      "reel-" + Date.now() + path.extname(file.originalname)
    cb(null, uniqueName)
  },
})

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true)
  } else {
    cb(new Error("Only video files allowed"))
  }
}

export const uploadReel = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
})
