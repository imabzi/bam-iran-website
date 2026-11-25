"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contact } from "@/data/company";
import { useLanguage } from "@/lib/usePreferences";
import { ContactLinks } from "./ContactLinks";

/**
 * BAM's global contact toolbar: Instagram, LinkedIn and Phone stacked
 * vertically, fixed to the bottom-right corner in every language. Mounted once
 * in the root layout, so it stays across navigation.
 *
 * - Only verified destinations are shown. LinkedIn stays hidden until an
 *   approved URL is set in data/company.ts (`contact.linkedin`).
 * - It steps aside while the footer is on screen: the footer carries the same
 *   contacts, and its controls sit in this corner.
 * - It sits below the header and the mobile menu (z-index), so dialogs cover it.
 */
export function FloatingContact() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer) {
      setFooterVisible(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { rootMargin: "0px 0px -40px 0px" });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  // The admin prototype is an internal tool, not a public page.
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className={footerVisible ? "floating-contact is-hidden" : "floating-contact"} aria-label={t.floatingContactLabel} inert={footerVisible}>
      <ContactLinks
        className="contact-links-floating"
        order={["instagram", "linkedin", "phone"]}
        channels={{ instagram: contact.social[0]?.url, linkedin: contact.linkedin, phone: contact.centralOffice.phones[0] }}
        labels={{ instagram: t.instagramBam, linkedin: t.linkedinBam, phone: t.callBam }}
      />
    </nav>
  );
}
