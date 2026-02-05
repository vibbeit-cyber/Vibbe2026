import { Request, Response } from "express"
import { db } from "../db"

export const toggleLike = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id
    const reelId = Number(req.params.reelId)

    if (!reelId || isNaN(reelId)) {
      return res.status(400).json({ message: "Invalid reel id" })
    }

    try {
      await db.query(
        `
        INSERT INTO likes (user_id, reel_id)
        VALUES ($1, $2)
        `,
        [userId, reelId]
      )

      return res.json({ liked: true })
    } catch (err: any) {
      if (err.code === "23505") {
        await db.query(
          `
          DELETE FROM likes
          WHERE user_id = $1 AND reel_id = $2
          `,
          [userId, reelId]
        )

        return res.json({ liked: false })
      }

      throw err
    }
  } catch (error) {
    console.error("🔥 toggleLike error:", error)
    return res.status(500).json({ message: "Like toggle failed" })
  }
}
