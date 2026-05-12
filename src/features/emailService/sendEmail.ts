import resend from "./transporter.js";

type MailRecipientType = {
  html: string;
  subject: string;
  email?: string;
  senderName?: string;
  name?: string;
};

type SendResult =
  | { sent: true; id: string | undefined }
  | { sent: false; error: string };

const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 750;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const describeError = (err: unknown): string => {
  if (!err) return "unknown";
  if (typeof err === "string") return err;
  if (err instanceof Error) {
    const cause = (err as { cause?: unknown }).cause;
    const code =
      (err as { code?: string }).code ??
      (cause && typeof cause === "object"
        ? (cause as { code?: string }).code
        : undefined);
    return [err.name, err.message, code && `code=${code}`]
      .filter(Boolean)
      .join(": ");
  }
  const anyErr = err as { name?: string; message?: string };
  return anyErr.message || anyErr.name || JSON.stringify(err);
};

const buildFrom = (senderName?: string) => {
  const configured =
    process.env.RESEND_FROM_EMAIL ||
    process.env.EMAIL ||
    "onboarding@resend.dev";
  // If the env var is already in "Name <addr>" form, use it as-is to avoid
  // double-wrapping the display name.
  if (configured.includes("<") && configured.includes(">")) {
    return configured;
  }
  const name =
    senderName || process.env.APP_NAME || "Foreware Technologies";
  return `${name} <${configured}>`;
};

const trySend = async (payload: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { data, error } = await resend.emails.send(payload);

      if (!error) {
        console.log(
          `[email] sent to ${payload.to} (id=${data?.id ?? "?"}) on attempt ${attempt}`,
        );
        return { sent: true, id: data?.id };
      }

      const isNetworkError =
        error.name === "application_error" &&
        /unable to fetch|could not be resolved/i.test(error.message ?? "");

      // Permanent errors that retries can never fix — bail immediately.
      // Resend's SDK types `name` as a narrow union that omits some real codes,
      // so compare as string against the documented set.
      const errorName = error.name as string;
      const isPermanent =
        errorName === "validation_error" ||
        errorName === "invalid_api_key" ||
        errorName === "missing_api_key" ||
        errorName === "restricted_api_key" ||
        errorName === "invalid_from_address" ||
        errorName === "invalid_to_address";

      console.error(
        `[email] attempt ${attempt}/${MAX_ATTEMPTS} failed for ${payload.to}` +
          (isNetworkError
            ? " (network/transport — request never reached Resend API):"
            : isPermanent
              ? " (permanent — not retrying):"
              : ":"),
        {
          name: error.name,
          message: error.message,
          from: payload.from,
        },
      );

      if (isPermanent) {
        return {
          sent: false,
          error: error.message || error.name || "send failed",
        };
      }

      if (attempt < MAX_ATTEMPTS) {
        await wait(BASE_BACKOFF_MS * attempt);
      } else {
        return {
          sent: false,
          error: error.message || error.name || "send failed",
        };
      }
    } catch (err: unknown) {
      const cause = (err as { cause?: unknown })?.cause;
      console.error(
        `[email] attempt ${attempt}/${MAX_ATTEMPTS} threw for ${payload.to}:`,
        {
          summary: describeError(err),
          cause: cause ? describeError(cause) : undefined,
          raw: err,
        },
      );
      if (attempt < MAX_ATTEMPTS) {
        await wait(BASE_BACKOFF_MS * attempt);
      } else {
        return { sent: false, error: describeError(err) };
      }
    }
  }
  return { sent: false, error: "exhausted retries" };
};

const sendEmail = async ({
  email,
  html,
  subject,
  senderName,
}: MailRecipientType): Promise<SendResult> => {
  if (!email) {
    console.error("[email] no recipient provided; skipping send");
    return { sent: false, error: "no recipient" };
  }

  return trySend({
    from: buildFrom(senderName),
    to: email,
    subject,
    html,
  });
};

export const sendGEmail = async ({
  email,
  html,
  subject,
  name,
}: MailRecipientType): Promise<SendResult> => {
  if (!email) {
    return { sent: false, error: "no recipient" };
  }
  return trySend({
    from: buildFrom(name),
    to: email,
    subject,
    html,
  });
};

export default sendEmail;
