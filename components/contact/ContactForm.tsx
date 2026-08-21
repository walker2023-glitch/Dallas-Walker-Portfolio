"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Real contact form, adapted from the Stitch mockup's "TRANSMISSION_DETAILS"
 * panel (Rough Draft lines 1547-1576) — name / email / message only, no
 * phone number field (plan §18 item 10, resolved as "omit"). Posts to
 * `/api/contact` (FR-11, plan §9).
 *
 * Includes a hidden honeypot field (`company`) that real visitors never
 * see; it's visually hidden and removed from the tab order so screen-reader
 * users aren't affected, but left in the DOM/name so naive bots that
 * auto-fill every field still trip it server-side.
 */
export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      const data = (await res.json()) as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        setState("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  const isSubmitting = state === "submitting";

  return (
    <div className="glass-panel p-6 border border-outline-variant">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-title-sm text-title-sm text-primary flex items-center gap-2">
          <span className="material-symbols-outlined" aria-hidden>
            satellite_alt
          </span>
          Transmission_Details
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="contact-name" className="font-code-label text-code-label text-on-surface-variant block uppercase">
            Sender_Identity
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={100}
            disabled={isSubmitting}
            placeholder="Your name"
            className="w-full bg-[#050505] border border-outline-variant focus:border-primary text-on-surface px-4 py-3 font-ui-utility text-body-base outline-none transition-all disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="font-code-label text-code-label text-on-surface-variant block uppercase">
            Return_Coordinates
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            disabled={isSubmitting}
            placeholder="you@example.com"
            className="w-full bg-[#050505] border border-outline-variant focus:border-primary text-on-surface px-4 py-3 font-ui-utility text-body-base outline-none transition-all disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-message" className="font-code-label text-code-label text-on-surface-variant block uppercase">
            Message_Payload
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            maxLength={5000}
            rows={6}
            disabled={isSubmitting}
            placeholder="What would you like to say?"
            className="w-full bg-[#050505] border border-outline-variant focus:border-primary text-on-surface px-4 py-3 font-ui-utility text-body-base outline-none transition-all resize-none disabled:opacity-60"
          />
        </div>

        {/* Honeypot — hidden from real visitors, left in the DOM for bots. */}
        <div className="w-0 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-primary text-on-primary font-ui-utility text-ui-utility uppercase tracking-widest emerald-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden>
            send
          </span>
          {isSubmitting ? "Transmitting..." : "Initiate_Transmission"}
        </button>

        <div role="status" aria-live="polite">
          {state === "success" ? (
            <p className="font-code-label text-code-label text-primary uppercase">
              Transmission received — thanks for reaching out. I&apos;ll reply by email soon.
            </p>
          ) : null}
          {state === "error" ? (
            <p className="font-code-label text-code-label text-error uppercase">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
