import { AppError } from "../../utils/AppError.js";
import mailTransporter from "./transporter.js";

type MailRecipientType = {
  html: string;
  subject: string;
  email?: string;
  sender?: string;
  name?: string;
};

const sendEmail = async ({
  email,
  html,
  subject,
  sender,
}: MailRecipientType) => {
  const fromEmail = process.env.EMAIL;

  if (fromEmail) {
    const mailOptions = {
      to: email,
      from: {
        name: sender || process.env.APP_NAME!,
        address: fromEmail,
      },
      subject,
      html,
    };

    try {
      const info = await mailTransporter({
        host: process.env.EMAIL_HOST!,
        pass: process.env.EMAIL_PASS!,
        user: process.env.EMAIL!,
      }).sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error: any) {
      console.log("SENDING EMAIL FAILED", email, error);
      throw new AppError(error.message || "SENDING EMAIL FAILED", 502);
    }
  }
};

export const sendGEmail = async ({
  email,
  html,
  subject,
  name,
}: MailRecipientType) => {
  const fromEmail = process.env.G_EMAIL;

  if (fromEmail) {
    const mailOptions = {
      to: email,
      from: {
        name: name || process.env.APP_NAME!,
        address: fromEmail,
      },
      subject,
      html,
    };

    try {
      const info = await mailTransporter({
        host: process.env.G_EMAIL_HOST!,
        pass: process.env.G_EMAIL_PASS!,
        user: process.env.G_EMAIL!,
      }).sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.log("SENDING EMAIL FAILED", email, error);
    }
  }
};

export default sendEmail;
