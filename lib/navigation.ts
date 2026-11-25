import type { Dictionary } from "./i18n";

export type NavItem = { href: string; label: (t: Dictionary) => string };

export const primaryNavigation: NavItem[] = [
  { href: "/projects", label: (t) => t.navProjects },
  { href: "/architects", label: (t) => t.navArchitects },
  { href: "/events", label: (t) => t.navEvents },
  { href: "/journal", label: (t) => t.navJournal },
  { href: "/about", label: (t) => t.navAbout },
];

export const contactNavigation: NavItem = { href: "/contact", label: (t) => t.navContact };

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
