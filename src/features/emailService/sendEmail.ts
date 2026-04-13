import { AppError } from "../../utils/AppError.js";
import mailTransporter from "./transporter.js";

type MailRecipientType = {
  html: string;
  subject: string;
  email?: string;
  senderName?: string;
  name?: string;
};

const sendEmail = async ({
  email, // The recipient (Admin)
  html,
  subject,
  senderName, // Optional name for the sender
}: MailRecipientType) => {
  const fromEmail = process.env.EMAIL || "noreply@forewaretechnologies.com";

  if (!email) {
    throw new AppError("No recipient email provided", 400);
  }

  const mailOptions = {
    to: email,
    // The "from" should be your verified system email
    from: {
      name: senderName || process.env.APP_NAME || "Foreware Technologies",
      address: fromEmail,
    },
    subject,
    html,
  };

  try {
    const transporter = mailTransporter({
      host: process.env.EMAIL_HOST!,
      pass: process.env.EMAIL_PASS!,
      user: process.env.EMAIL!,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error: any) {
    console.error("SENDING EMAIL FAILED", email, error);
    throw new AppError(error.message || "SENDING EMAIL FAILED", 502);
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
