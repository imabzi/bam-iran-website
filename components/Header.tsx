"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { contactNavigation, isActivePath, isNavGroup, primaryNavigation, type NavGroup } from "@/lib/navigation";
import { useLanguage } from "@/lib/usePreferences";
import { BrandMark } from "./BrandMark";
import { ChevronIcon, MenuIcon } from "./Icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

/**
 * The global header. `overlay` places it over a full-bleed hero: transparent,
 * with reversed text, until the page scrolls, when it becomes a solid,
 * theme-aware bar. Every other page uses the solid sticky bar from the start.
 */
/**
 * A header link with a small menu of related pages (About, Team, Awards).
 * Opens on hover and keyboard focus, and on click or Enter for touch and
 * keyboard users; Escape closes it.
 */
function NavMenu({ group, pathname }: { group: NavGroup; pathname: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const active = group.children.some((child) => isActivePath(pathname, child.href));
  const menuId = `nav-menu-${group.href.slice(1)}`;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  return (
    <li
      ref={ref}
      className={open ? "nav-group open" : "nav-group"}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
        }
      }}
      onBlur={(event) => {
        if (!ref.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        className={active ? "nav-link nav-group-toggle active" : "nav-link nav-group-toggle"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        {group.label(t)}
        <ChevronIcon className="icon nav-chevron" />
      </button>
      <ul id={menuId} className="nav-menu">
        {group.children.map((child) => {
          const current = isActivePath(pathname, child.href);
          return (
            <li key={child.href}>
              <Link href={child.href} className={current ? "nav-menu-link active" : "nav-menu-link"} aria-current={current ? "page" : undefined}>
                {child.label(t)}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function Header({ overlay = false }: { overlay?: boolean }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!overlay) return;
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overlay]);

  // A route change closes the menu.
  useEffect(() => setMenuOpen(false), [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);

  const classes = ["site-header"];
  if (overlay) classes.push("is-overlay");
  if (overlay && !scrolled && !menuOpen) classes.push("is-transparent");

  return (
    <>
      <header className={classes.join(" ")}>
        <div className="header-inner">
          <Link href="/" className="brand" aria-label={t.brandLabel}>
            <BrandMark className="brand-logo" priority sizes="64px" />
          </Link>

          <nav className="primary-nav" aria-label={t.primaryNavigation}>
            <ul>
              {primaryNavigation.map((item) => {
                if (isNavGroup(item)) return <NavMenu key={item.href} group={item} pathname={pathname} />;
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={active ? "nav-link active" : "nav-link"} aria-current={active ? "page" : undefined}>
                      {item.label(t)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header-tools">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Link
              href={contactNavigation.href}
              className={isActivePath(pathname, contactNavigation.href) ? "header-contact active" : "header-contact"}
              aria-current={isActivePath(pathname, contactNavigation.href) ? "page" : undefined}
            >
              {contactNavigation.label(t)}
            </Link>
            <button
              ref={menuButton}
              type="button"
              className="menu-button"
              aria-label={t.menuOpen}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      <MobileNavigation open={menuOpen} onClose={closeMenu} />
    </>
  );
}
