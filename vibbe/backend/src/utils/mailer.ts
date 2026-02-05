import nodemailer from "nodemailer"
import {
  otpEmailTemplate,
  resetPasswordOtpTemplate,
} from "./otp"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

// 👇 tell mailer which OTP type this is
type OtpType = "signup" | "reset"

export const sendOTPEmail = async (
  to: string,
  otp: string,
  type: OtpType,
  username?: string
) => {
  let subject = ""
  let html = ""

  // 🔐 RESET PASSWORD OTP
  if (type === "reset") {
    subject = "Your OTP to Reset Vibbe Password"
    html = resetPasswordOtpTemplate(otp)
  }

  // 🔐 SIGNUP / VERIFY OTP
  if (type === "signup") {
    subject = `${otp} is your Vibbe Sign Up Code`
    html = otpEmailTemplate(username || "there", otp)
  }

  await transporter.sendMail({
    from: `"Vibbe" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  })
}
