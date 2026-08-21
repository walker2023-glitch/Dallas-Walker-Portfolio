import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/config/site";
import { rateLimit } from "@/lib/rateLimit";

/**
 * POST /api/contact — per plan §9: `{ name, email, message }` -> `{ success, error? }`.
 *
 * Delivers via Resend (FR-11). Basic validation + a honeypot field + a
 * per-IP rate limit guard against spam (Risks table). No phone number is
 * ever collected or forwarded — the contact form is name/email/message
 * only (plan §18 item 10, resolved as "omit").
 */

const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }; // 5 submissions / 10 min / IP

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Strip control/newline characters that could be used for header/log injection. */
function sanitizeLine(value: string): string {
  return value.replace(/[\r\n\t\0]/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  const { allowed, retryAfterSeconds } = rateLimit(`contact:${ip}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many submissions. Please try again shortly.",
      },
      { status: 429, headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const {
    name,
    email,
    message,
    // Honeypot: a field real visitors never see or fill (hidden in the UI).
    // Bots that auto-fill every input will trip this. Field name is
    // deliberately generic-looking so it doesn't read as an obvious trap.
    company: honeypot,
  } = (body ?? {}) as Record<string, unknown>;

  // Honeypot tripped: pretend success so the bot doesn't learn it failed,
  // but never actually send an email.
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return jsonError("Name, email, and message are all required.", 400);
  }

  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return jsonError("One or more fields exceed the maximum length.", 400);
  }

  const cleanName = sanitizeLine(name);
  const cleanEmail = sanitizeLine(email);
  const cleanMessage = message.trim();

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return jsonError("Please provide a valid email address.", 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("/api/contact: RESEND_API_KEY is not set");
    return jsonError("Email service is not configured yet. Please reach out via email directly.", 503);
  }

  const toAddress = process.env.CONTACT_TO_EMAIL || site.email;
  // onboarding@resend.dev only delivers to the Resend account owner and is
  // for testing only — swap CONTACT_FROM_EMAIL to a verified-domain address
  // before relying on this in production (see README).
  const fromAddress = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: toAddress,
    replyTo: cleanEmail,
    subject: `New portfolio contact from ${cleanName}`,
    text: `From: ${cleanName} <${cleanEmail}>\n\n${cleanMessage}`,
    html: `<p><strong>From:</strong> ${escapeHtml(cleanName)} &lt;${escapeHtml(cleanEmail)}&gt;</p><p>${escapeHtml(
      cleanMessage
    ).replace(/\n/g, "<br />")}</p>`,
  });

  if (error) {
    console.error("/api/contact: Resend error", error);
    return jsonError("Could not send your message. Please try again later.", 502);
  }

  return NextResponse.json({ success: true });
}
