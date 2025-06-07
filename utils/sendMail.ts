import nodemailer from "nodemailer"

export async function sendMail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // app password, not your main password
    },
  })

  const mailOptions = {
    from: `"Threat Detection AI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  }

  await transporter.sendMail(mailOptions)
}
