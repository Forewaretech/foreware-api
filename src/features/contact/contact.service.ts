import { prisma } from "../../config/db.js";
import sendEmail from "../emailService/sendEmail.js";
import type { ContactType } from "./contact.validation.js";

export const contactUs = async (data: ContactType) => {
  const sendTo = await prisma.emailTo.findFirst();
  const appName = process.env.APP_NAME || "Foreware Technologies";
  const primaryColor = "#00A7E5";
  const darkNavy = "#000D30";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Inquiry</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #F2F2F2; color: #191919;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #D9D9D9; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              
              <tr>
                <td align="center" style="background-color: ${darkNavy}; padding: 30px 20px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">${appName}</h1>
                  <p style="color: ${primaryColor}; margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">New Contact Inquiry</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; line-height: 24px; margin-bottom: 30px;">
                    Hello Admin,<br><br>
                    You have received a new message from your website contact form. Here are the details:
                  </p>

                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td width="30%" style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #F2F2F2;">Name:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F2F2F2;">${data.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #F2F2F2;">Email:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F2F2F2;"><a href="mailto:${data.email}" style="color: ${primaryColor}; text-decoration: none;">${data.email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #F2F2F2;">Phone:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F2F2F2;">${data.phone || "N/A"}</td>
                    </tr>
                  </table>

                  <div style="background-color: #F9F9F9; border-left: 4px solid ${primaryColor}; padding: 20px; border-radius: 4px;">
                    <p style="margin: 0; font-weight: bold; color: ${darkNavy}; margin-bottom: 8px;">Message:</p>
                    <p style="margin: 0; line-height: 1.6; color: #131313; font-style: italic;">"${data.message}"</p>
                  </div>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 30px; background-color: #F2F2F2; border-top: 1px solid #D9D9D9;">
                  <p style="margin: 0; font-size: 12px; color: #666666;">
                    &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 11px; color: #999999;">
                    This is an automated message generated from the contact form.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  console.log("3. Attempting to call sendEmail...");
  const result = await sendEmail({
    html: htmlContent,
    subject: `${appName} - Inquiry from ${data.name}`,
    email: sendTo?.email || "forewaretech@gmail.com",
    senderName: appName, // Explicitly pass the sender name
  });
  console.log("4. Final result:", result);
  return result;
};
