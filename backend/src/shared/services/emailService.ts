import nodemailer from "nodemailer";
import keys from "../../config/keys";

/**
 * Sends an email using Nodemailer.
 * @param to - Recipient's email address.
 * @param subject - Email subject.
 * @param text - Plain text email content.
 * @param html - HTML formatted email content.
 */

const emailKeys = keys.email;

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: emailKeys.host,
      port: Number(emailKeys.port),
      secure: true, // true for TLS (port 465)
      auth: {
        user: emailKeys.user,
        pass: emailKeys.pass,
      },
    });

    await transporter.sendMail({
      from: `"Your Server" <${emailKeys.user}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`📧 Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};
