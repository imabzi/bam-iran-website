"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { contactNavigation, isActivePath, primaryNavigation } from "@/lib/navigation";
import { useLanguage } from "@/lib/usePreferences";
import { BrandLogo } from "./BrandLogo";
import { MenuIcon } from "./Icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

/**
 * The global header. `overlay` places it over a full-bleed hero: transparent,
 * with reversed text, until the page scrolls, when it becomes a solid,
 * theme-aware bar. Every other page uses the solid sticky bar from the start.
 */
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
            <BrandLogo className="brand-logo" />
          </Link>

          <nav className="primary-nav" aria-label={t.primaryNavigation}>
            <ul>
              {primaryNavigation.map((item) => {
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
