import type { Dictionary } from "./i18n";

export type NavItem = { href: string; label: (t: Dictionary) => string };
export type NavGroup = NavItem & { children: NavItem[] };

export const homeNavigation: NavItem = { href: "/", label: (t) => t.navHome };
export const aboutNavigation: NavItem = { href: "/about", label: (t) => t.navAbout };
export const teamNavigation: NavItem = { href: "/team", label: (t) => t.navTeam };
export const awardsNavigation: NavItem = { href: "/awards", label: (t) => t.navAwards };
export const contactNavigation: NavItem = { href: "/contact", label: (t) => t.navContact };

// The desktop header: short top-level links, and one group for the company
// pages so the bar stays uncrowded.
export const primaryNavigation: Array<NavItem | NavGroup> = [
  { href: "/projects", label: (t) => t.navProjects },
  { href: "/architects", label: (t) => t.navArchitects },
  { href: "/events", label: (t) => t.navEvents },
  { href: "/journal", label: (t) => t.navJournal },
  { ...aboutNavigation, children: [aboutNavigation, teamNavigation, awardsNavigation] },
];

// Every page, in the approved order: the mobile menu and the footer.
export const siteNavigation: NavItem[] = [
  homeNavigation,
  { href: "/projects", label: (t) => t.navProjects },
  { href: "/architects", label: (t) => t.navArchitects },
  teamNavigation,
  awardsNavigation,
  { href: "/events", label: (t) => t.navEvents },
  { href: "/journal", label: (t) => t.navJournal },
  aboutNavigation,
  contactNavigation,
];

export function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return "children" in item;
}

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
