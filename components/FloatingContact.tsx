"use client";

import { usePathname } from "next/navigation";
import { contact } from "@/data/company";
import { useLanguage } from "@/lib/usePreferences";
import { ContactLinks } from "./ContactLinks";

/**
 * BAM's global contact toolbar: Instagram, LinkedIn and Phone stacked
 * vertically, fixed to the bottom-right corner in every language. Mounted once
 * in the root layout, so it stays across navigation and is visible on every
 * public page, the footer included (the footer's bottom bar keeps clear of it).
 *
 * - Only verified destinations link anywhere. LinkedIn keeps its icon, shown
 *   disabled, until an approved URL is set in data/company.ts
 *   (`contact.linkedin`).
 * - It sits below the header and the mobile menu (z-index), so dialogs cover it.
 */
export function FloatingContact() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // The admin prototype is an internal tool, not a public page.
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="floating-contact" aria-label={t.floatingContactLabel}>
      <ContactLinks
        className="contact-links-floating"
        order={["instagram", "linkedin", "phone"]}
        channels={{ instagram: contact.social[0]?.url, linkedin: contact.linkedin, phone: contact.centralOffice.phones[0] }}
        labels={{ instagram: t.instagramBam, linkedin: t.linkedinBam, phone: t.callBam }}
        unavailable={{ linkedin: t.linkedinUnavailable }}
      />
    </nav>
  );
}
