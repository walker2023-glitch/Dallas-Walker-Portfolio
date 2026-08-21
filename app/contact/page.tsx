import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { NetworkNodes } from "@/components/contact/NetworkNodes";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dallas Walker.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact_Protocol"
        path="Directory://root/etc/contact.sys"
        eyebrow="[MODULE_ID: 06]"
      />

      <p className="font-body-base text-on-surface-variant max-w-2xl mb-8">
        Send a message below, or reach out directly through one of the links on
        the right. No phone number is listed here by design — email is the
        fastest way to reach me.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        <div className="xl:col-span-7">
          <ContactForm />
        </div>
        <div className="xl:col-span-5">
          <NetworkNodes />
        </div>
      </div>
    </>
  );
}
