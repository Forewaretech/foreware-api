import { Resend } from "resend";

const rawKey = process.env.RESEND_API_KEY;
const apiKey = rawKey?.trim().replace(/^["']|["']$/g, "");

if (!apiKey) {
  console.warn(
    "RESEND_API_KEY is not set — outbound emails will fail until configured.",
  );
} else if (rawKey !== apiKey) {
  console.warn(
    "[email] RESEND_API_KEY had surrounding whitespace or quotes — trimmed. " +
      "Fix the .env value to avoid auth-header issues.",
  );
}

if (apiKey && !/^re_[A-Za-z0-9_]+$/.test(apiKey)) {
  console.warn(
    "[email] RESEND_API_KEY does not match the expected `re_…` shape; " +
      "Resend will likely reject it.",
  );
}

const resend = new Resend(apiKey);

export default resend;
