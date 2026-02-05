import { Request, Response } from "express"
import { db } from "../db"
import fs from "fs"
import path from "path"

// =========================
// CREATE REEL
// =========================
export const createReel = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id
    const { caption } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Video is required" })
    }

    const videoUrl = `/uploads/reels/${req.file.filename}`

    const result = await db.query(
      `
      INSERT INTO reels (user_id, video_url, caption)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, videoUrl, caption]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("🔥 createReel error:", error)
    res.status(500).json({ message: "Failed to create reel" })
  }
}

// =========================
// GET REELS FEED (ENRICHED + PAGINATION)
// =========================
export const getReelsFeed = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (page - 1) * limit

    // logged-in user (optional)
    const userId = req.user?.id || null

    const result = await db.query(
      `
      SELECT
        r.id,
        r.video_url,
        r.caption,
        r.created_at,
        r.views,

        COUNT(DISTINCT l.id) AS likes_count,
        COUNT(DISTINCT c.id) AS comments_count,
        BOOL_OR(l.user_id = $1) AS is_liked

      FROM reels r
      LEFT JOIN likes l ON l.reel_id = r.id
      LEFT JOIN comments c ON c.reel_id = r.id

      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [userId, limit, offset]
    )

    res.json({
      page,
      limit,
      reels: result.rows,
    })
  } catch (error) {
    console.error("🔥 getReelsFeed error:", error)
    res.status(500).json({ message: "Failed to fetch reels feed" })
  }
}

// =========================
// INCREMENT REEL VIEW
// =========================
export const incrementReelView = async (req: Request, res: Response) => {
  try {
    const reelId = Number(req.params.id)

    if (!reelId || isNaN(reelId)) {
      return res.status(400).json({ message: "Invalid reel id" })
    }

    await db.query(
      `
      UPDATE reels
      SET views = views + 1
      WHERE id = $1
      `,
      [reelId]
    )

    res.json({ success: true })
  } catch (error) {
    console.error("🔥 incrementReelView error:", error)
    res.status(500).json({ message: "Failed to update views" })
  }
}

// =========================
// DELETE REEL + CLEANUP
// =========================
export const deleteReel = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const reelId = Number(req.params.id)
    const userId = req.user.id

    if (!reelId || isNaN(reelId)) {
      return res.status(400).json({ message: "Invalid reel id" })
    }

    const reelResult = await db.query(
      `
      SELECT video_url, user_id
      FROM reels
      WHERE id = $1
      `,
      [reelId]
    )

    if (reelResult.rows.length === 0) {
      return res.status(404).json({ message: "Reel not found" })
    }

    const reel = reelResult.rows[0]

    // only owner can delete
    if (reel.user_id !== userId) {
      return res.status(403).json({ message: "Forbidden" })
    }

    // delete reel (likes & comments removed via CASCADE)
    await db.query(
      `
      DELETE FROM reels
      WHERE id = $1
      `,
      [reelId]
    )

    // delete video file
    const videoPath = path.join(
      __dirname,
      "..",
      "..",
      reel.video_url
    )

    fs.unlink(videoPath, () => {})

    res.json({ success: true })
  } catch (error) {
    console.error("🔥 deleteReel error:", error)
    res.status(500).json({ message: "Failed to delete reel" })
  }
}
