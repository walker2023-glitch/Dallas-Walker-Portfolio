import { site } from "@/config/site";

/**
 * Real quick-link panel, adapted from the Stitch mockup's "NETWORK_NODES"
 * card (Rough Draft lines 1580-1609). Only real links (GitHub, LinkedIn,
 * email) — the mockup's decorative "PRIMARY_LOC_STATION" map widget is
 * intentionally dropped rather than fabricate a location (plan §18 item 9,
 * still open).
 */
export function NetworkNodes() {
  const links = [
    { href: site.githubUrl, label: "GITHUB_REPOSITORY", icon: "terminal" },
    { href: site.linkedInUrl, label: "LINKEDIN_PROFILE", icon: "person_search" },
    { href: `mailto:${site.email}`, label: "SECURE_MAIL_GATE", icon: "mail" },
  ];

  return (
    <div className="bg-surface-container border border-outline-variant p-6">
      <h3 className="font-title-sm text-title-sm text-primary flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined" aria-hidden>
          hub
        </span>
        Network_Nodes
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
            className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-outline-variant hover:border-primary transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-outline group-hover:text-primary" aria-hidden>
                {link.icon}
              </span>
              <span className="font-code-label text-code-label uppercase">{link.label}</span>
            </div>
            <span className="material-symbols-outlined text-outline text-[16px]" aria-hidden>
              open_in_new
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
