// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// OTP expiry time (5 minutes)
export const otpExpiry = () => {
  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + 5)
  return expires
}

// ===============================
// SIGNUP / VERIFY OTP EMAIL TEMPLATE
// ===============================
export const otpEmailTemplate = (username: string, otp: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vibbe OTP</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 130%;
    font-weight: 300;
    color: #000000;
  "
>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 24px 12px">
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width: 520px;
            background-color: #f7f7f7;
            border-radius: 14px;
            padding: 24px;
          "
        >

          <tr>
            <td
              style="
                font-size: 20px;
                font-weight: 400;
                font-style: italic;
                padding-bottom: 16px;
              "
            >
              Vibbe
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 12px">
              Hi ${username},
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 12px">
              To continue signing in, please verify your identity for security
              purposes.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 20px">
              A one-time passcode (OTP) has been sent to your registered email
              address.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 16px 0 24px">
              <div
                style="
                  font-size: 16px;
                  font-weight: 400;
                  letter-spacing: 4px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  padding: 14px 24px;
                  display: inline-block;
                "
              >
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 12px">
              This code is time-sensitive and will expire shortly. For your
              security, do not share this code with anyone.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 12px">
              If you did not request this sign-in or did not receive the code,
              you may ignore this message or request a new OTP.
            </td>
          </tr>

          <tr>
            <td>
              Once verified, you will be securely signed in.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// ===============================
// RESET PASSWORD OTP EMAIL TEMPLATE
// ===============================
export const resetPasswordOtpTemplate = (otp: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Vibbe Password</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 300;
    line-height: 130%;
    color: #000000;
  "
>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 16px">
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width: 520px;
            background-color: #f7f7f7;
            border-radius: 14px;
            padding: 32px;
          "
        >

          <tr>
            <td
              style="
                font-size: 22px;
                font-weight: 400;
                font-style: italic;
                padding-bottom: 16px;
              "
            >
              Vibbe
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 12px">
              Hello
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 12px">
              We received a request to reset the password for your Vibbe account.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 20px">
              To proceed, please use the One-Time Passcode (OTP) below:
            </td>
          </tr>

          <tr>
            <td
              align="center"
              style="
                font-size: 28px;
                font-weight: 400;
                letter-spacing: 4px;
                padding: 16px 0 24px;
              "
            >
              ${otp}
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 12px">
              This OTP is valid for a limited time and is for your security.
              Please do not share this code with anyone. Vibbe will never ask
              you for your OTP.
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 20px">
              If you did not request a password reset, you can safely ignore
              this email.
            </td>
          </tr>

          <tr>
            <td>
              Thank you,<br />
              <strong>Team Vibbe</strong>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
