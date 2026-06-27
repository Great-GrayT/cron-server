import { logger } from "@/lib/logger";
import { sendSmtpMail } from "@/lib/FUNC-smtp";

/**
 * Provider-agnostic transactional email. The first configured provider wins:
 *
 *   SMTP       — SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS
 *                (e.g. Gmail App Password — sends THROUGH Gmail, no domain needed)
 *   Brevo      — BREVO_API_KEY      (HTTP; needs a verified domain)
 *   SendGrid   — SENDGRID_API_KEY   (HTTP; needs a verified domain/sender)
 *   Resend     — RESEND_API_KEY     (HTTP; needs a verified domain)
 *
 * Set EMAIL_FROM to your sender, e.g.
 *   EMAIL_FROM="JobCron <youraccount@gmail.com>"   (must match SMTP_USER for Gmail)
 *
 * If nothing is configured the message is logged instead of sent, so local dev
 * works without an account (the verification/reset link prints to the log).
 */

function fromRaw(): string {
  return process.env.EMAIL_FROM || "JobCron <onboarding@resend.dev>";
}

/** Parse "Name <email>" (or a bare email) into parts. */
function parseFrom(raw: string): { email: string; name?: string } {
  const m = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1] || undefined, email: m[2].trim() };
  return { email: raw.trim() };
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const from = parseFrom(fromRaw());

  const smtpHost = process.env.SMTP_HOST;
  const brevo = process.env.BREVO_API_KEY;
  const sendgrid = process.env.SENDGRID_API_KEY;
  const resend = process.env.RESEND_API_KEY;

  if (smtpHost) {
    logger.info(`[email] sending via SMTP ${smtpHost} to ${to}: ${subject}`);
    await sendSmtpMail(
      {
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 465),
        user: process.env.SMTP_USER || from.email,
        pass: process.env.SMTP_PASS || "",
      },
      { from: from.email, fromName: from.name, to, subject, html },
    );
    return;
  }

  if (brevo) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevo, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { email: from.email, name: from.name ?? "JobCron" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) throw new Error(`Brevo send failed (${res.status}): ${await res.text().catch(() => "")}`);
    return;
  }

  if (sendgrid) {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${sendgrid}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from.email, name: from.name },
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });
    if (!res.ok) throw new Error(`SendGrid send failed (${res.status}): ${await res.text().catch(() => "")}`);
    return;
  }

  if (resend) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromRaw(), to, subject, html }),
    });
    if (!res.ok) throw new Error(`Resend send failed (${res.status}): ${await res.text().catch(() => "")}`);
    return;
  }

  logger.warn(`[email] no provider key set — would send to ${to}: ${subject}`);
  logger.warn(`[email] body:\n${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`);
}

function layout(title: string, body: string, cta?: { label: string; url: string }): string {
  return `
  <div style="font-family:system-ui,Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#1a1f2e">
    <h2 style="color:#2563eb;margin:0 0 12px">${title}</h2>
    <div style="font-size:15px;line-height:1.6;color:#333">${body}</div>
    ${
      cta
        ? `<p style="margin:24px 0"><a href="${cta.url}" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block;font-weight:600">${cta.label}</a></p>
           <p style="font-size:12px;color:#888">If the button doesn't work, paste this link:<br><a href="${cta.url}">${cta.url}</a></p>`
        : ""
    }
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
    <p style="font-size:12px;color:#999">JobCron — automated job monitoring.</p>
  </div>`;
}

export async function sendVerificationEmail(to: string, link: string): Promise<void> {
  await sendEmail(
    to,
    "Verify your JobCron email",
    layout(
      "Confirm your email",
      "<p>Welcome to JobCron. Confirm your email address to activate your account. This link expires in 24 hours.</p>",
      { label: "Verify email", url: link },
    ),
  );
}

export async function sendPasswordResetEmail(to: string, link: string): Promise<void> {
  await sendEmail(
    to,
    "Reset your JobCron password",
    layout(
      "Reset your password",
      "<p>We received a request to reset your password. This link expires in 1 hour. If you didn't request this, ignore this email.</p>",
      { label: "Reset password", url: link },
    ),
  );
}
