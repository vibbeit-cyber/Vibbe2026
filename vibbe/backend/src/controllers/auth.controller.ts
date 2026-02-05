import { Request, Response } from "express"
import { db } from "../db"
import { hashPassword, comparePassword } from "../utils/password"
import { signToken } from "../utils/jwt"
import { sendOTPEmail } from "../utils/mailer"
import { generateOTP, otpExpiry } from "../utils/otp"

/* ---------------- REGISTER / SIGNUP ---------------- */

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, display_name } = req.body

    if (!email || !password || !display_name) {
      return res.status(400).json({ message: "All fields required" })
    }

    const existing = await db.query(
      `SELECT id, is_verified FROM users WHERE email=$1`,
      [email]
    )

    const passwordHash = await hashPassword(password)
    const otp = generateOTP()
    const expiresAt = otpExpiry()

    // 🔁 retry signup (user exists but not verified)
    if (existing.rows.length > 0 && !existing.rows[0].is_verified) {
      await db.query(
        `UPDATE users
         SET password_hash=$1,
             display_name=$2,
             otp_code=$3,
             otp_expires_at=$4
         WHERE email=$5`,
        [passwordHash, display_name, otp, expiresAt, email]
      )

      await sendOTPEmail(email, otp, "signup", display_name)

      return res.status(200).json({
        message: "OTP resent. Please verify your email",
      })
    }

    // ❌ already verified user
    if (existing.rows.length > 0 && existing.rows[0].is_verified) {
      return res.status(409).json({
        message: "Email already registered",
      })
    }

    // ✅ new user
    await db.query(
      `INSERT INTO users
       (email, password_hash, display_name, otp_code, otp_expires_at, is_verified)
       VALUES ($1,$2,$3,$4,$5,false)`,
      [email, passwordHash, display_name, otp, expiresAt]
    )

    await sendOTPEmail(email, otp, "signup", display_name)

    return res.status(201).json({
      message: "OTP sent to email",
    })
  } catch (err) {
    console.error("REGISTER ERROR:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

/* ---------------- VERIFY OTP (SIGNUP) ---------------- */

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" })
    }

    const result = await db.query(
      `SELECT otp_code, otp_expires_at
       FROM users WHERE email=$1`,
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const user = result.rows[0]

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    await db.query(
      `UPDATE users
       SET is_verified=true,
           otp_code=NULL,
           otp_expires_at=NULL
       WHERE email=$1`,
      [email]
    )

    return res.json({ message: "Email verified successfully" })
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

/* ---------------- FORGOT PASSWORD ---------------- */

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email required" })
    }

    const result = await db.query(
      `SELECT display_name, is_verified FROM users WHERE email=$1`,
      [email]
    )

    // 🔒 security: do not expose user existence
    if (result.rows.length === 0 || !result.rows[0].is_verified) {
      return res.json({
        message: "If account exists, OTP sent",
      })
    }

    const otp = generateOTP()
    const expiresAt = otpExpiry()

    await db.query(
      `UPDATE users
       SET otp_code=$1,
           otp_expires_at=$2
       WHERE email=$3`,
      [otp, expiresAt, email]
    )

    // ✅ RESET PASSWORD TEMPLATE
    await sendOTPEmail(email, otp, "reset")

    return res.json({ message: "OTP sent to email" })
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

/* ---------------- RESET PASSWORD ---------------- */

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" })
    }

    const result = await db.query(
      `SELECT otp_code, otp_expires_at
       FROM users WHERE email=$1`,
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid request" })
    }

    const user = result.rows[0]

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    const passwordHash = await hashPassword(newPassword)

    await db.query(
      `UPDATE users
       SET password_hash=$1,
           otp_code=NULL,
           otp_expires_at=NULL
       WHERE email=$2`,
      [passwordHash, email]
    )

    return res.json({ message: "Password reset successful" })
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

/* ---------------- LOGIN ---------------- */

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      })
    }

    const result = await db.query(
      `SELECT id, password_hash, is_verified
       FROM users WHERE email=$1`,
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const user = result.rows[0]

    if (!user.is_verified) {
      return res.status(403).json({ message: "Verify email first" })
    }

    const valid = await comparePassword(password, user.password_hash)

    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = signToken({ userId: user.id })

    return res.json({ token })
  } catch (err) {
    console.error("LOGIN ERROR:", err)
    return res.status(500).json({ message: "Server error" })
  }
}
