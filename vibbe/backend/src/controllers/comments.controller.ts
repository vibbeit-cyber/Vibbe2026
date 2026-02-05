import { Request, Response } from "express"
import { db } from "../db"

// ADD COMMENT
export const addComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id
    const reelId = Number(req.params.reelId)
    const { text } = req.body

    if (!reelId || isNaN(reelId)) {
      return res.status(400).json({ message: "Invalid reel id" })
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" })
    }

    const result = await db.query(
      `
      INSERT INTO comments (user_id, reel_id, text)
      VALUES ($1, $2, $3)
      RETURNING id, text, created_at
      `,
      [userId, reelId, text]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("🔥 addComment error:", error)
    res.status(500).json({ message: "Failed to add comment" })
  }
}

// GET COMMENTS FOR A REEL
export const getComments = async (req: Request, res: Response) => {
  try {
    const reelId = Number(req.params.reelId)

    if (!reelId || isNaN(reelId)) {
      return res.status(400).json({ message: "Invalid reel id" })
    }

    const result = await db.query(
      `
      SELECT
        c.id,
        c.text,
        c.created_at,
        u.id AS user_id,
        u.display_name
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.reel_id = $1
      ORDER BY c.created_at DESC
      `,
      [reelId]
    )

    res.json(result.rows)
  } catch (error) {
    console.error("🔥 getComments error:", error)
    res.status(500).json({ message: "Failed to fetch comments" })
  }
}
