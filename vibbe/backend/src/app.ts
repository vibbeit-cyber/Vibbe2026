import express from "express"
import cors from "cors"
import path from "path"
import "./db"

import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import reelsRoutes from "./routes/reels.routes"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Serve uploaded videos
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
)

// Health check
app.get("/", (_req, res) => {
  res.send("Vibbe backend running")
})

// Routes
app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/api/reels", reelsRoutes)

export default app
