"use client";

import type { ComponentType } from "react";
import { useLanguage } from "@/lib/usePreferences";
import { GlobeIcon, InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon } from "./Icons";
import { telHref } from "./Text";

export type ContactChannels = {
  instagram?: string;
  linkedin?: string;
  phone?: string;
  email?: string;
  website?: string;
};

type Channel = { id: keyof ContactChannels; href: string; label: string; external: boolean; Icon: ComponentType<{ className?: string }> };

/**
 * Circular outlined contact icons. Only channels with a verified value are
 * rendered: a missing value hides its icon, so nothing ever links to "#".
 * `order` sets which channels appear and in what order.
 */
export function ContactLinks({
  channels,
  order,
  className = "",
  labels,
}: {
  channels: ContactChannels;
  order: Array<keyof ContactChannels>;
  className?: string;
  // Optional override of each icon's accessible name (e.g. "Call BAM").
  labels?: Partial<Record<keyof ContactChannels, string>>;
}) {
  const { t } = useLanguage();
  const build = (id: keyof ContactChannels): Channel | null => {
    const value = channels[id]?.trim();
    if (!value) return null;
    switch (id) {
      case "phone":
        return { id, href: telHref(value), label: labels?.phone ?? `${t.contactPhone}: ${value}`, external: false, Icon: PhoneIcon };
      case "email":
        return { id, href: `mailto:${value}`, label: labels?.email ?? `${t.email}: ${value}`, external: false, Icon: MailIcon };
      case "website":
        return { id, href: value, label: labels?.website ?? t.website, external: true, Icon: GlobeIcon };
      case "instagram":
        return { id, href: value, label: labels?.instagram ?? t.instagram, external: true, Icon: InstagramIcon };
      case "linkedin":
        return { id, href: value, label: labels?.linkedin ?? t.linkedin, external: true, Icon: LinkedInIcon };
    }
  };
  const items = order.map(build).filter((item): item is Channel => item !== null);
  if (items.length === 0) return null;

  return (
    <ul className={`contact-links ${className}`}>
      {items.map(({ id, href, label, external, Icon }) => (
        <li key={id}>
          <a
            href={href}
            className="contact-link"
            aria-label={label}
            title={label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
