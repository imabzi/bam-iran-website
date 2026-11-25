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

type Channel = { id: keyof ContactChannels; href?: string; label: string; external: boolean; Icon: ComponentType<{ className?: string }> };

const icons: Record<keyof ContactChannels, ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  phone: PhoneIcon,
  email: MailIcon,
  website: GlobeIcon,
};

/**
 * Circular outlined contact icons. Only channels with a verified value link
 * anywhere, so nothing ever links to "#". A missing value hides its icon,
 * unless `unavailable` gives that channel a label: then the icon stays, shown
 * as a disabled, non-linking control with that accessible name.
 * `order` sets which channels appear and in what order.
 */
export function ContactLinks({
  channels,
  order,
  className = "",
  labels,
  unavailable,
}: {
  channels: ContactChannels;
  order: Array<keyof ContactChannels>;
  className?: string;
  // Optional override of each icon's accessible name (e.g. "Call BAM").
  labels?: Partial<Record<keyof ContactChannels, string>>;
  // Channels kept visible (disabled) when their destination is missing.
  unavailable?: Partial<Record<keyof ContactChannels, string>>;
}) {
  const { t } = useLanguage();
  const build = (id: keyof ContactChannels): Channel | null => {
    const value = channels[id]?.trim();
    if (!value) {
      const label = unavailable?.[id];
      return label ? { id, label, external: false, Icon: icons[id] } : null;
    }
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
          {href === undefined ? (
            // No destination yet: focusable so screen-reader and keyboard users
            // still find it, announced as disabled, and it goes nowhere.
            <a role="link" aria-disabled="true" tabIndex={0} className="contact-link is-unavailable" aria-label={label} title={label}>
              <Icon />
            </a>
          ) : (
          <a
            href={href}
            className="contact-link"
            aria-label={label}
            title={label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon />
          </a>
          )}
        </li>
      ))}
    </ul>
  );
}
