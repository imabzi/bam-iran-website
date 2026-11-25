"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { contactNavigation, isActivePath, primaryNavigation } from "@/lib/navigation";
import { useLanguage } from "@/lib/usePreferences";
import { CloseIcon } from "./Icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// The navigation drawer for narrow screens: a modal dialog that traps focus,
// closes with Escape or a click on the backdrop, and locks page scrolling.
export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className={open ? "mobile-nav open" : "mobile-nav"} hidden={!open}>
      <div className="mobile-nav-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        id="mobile-navigation"
        className="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t.menuTitle}
      >
        <div className="mobile-nav-head">
          <span className="mobile-nav-title">{t.menuTitle}</span>
          <button type="button" className="menu-close" aria-label={t.menuClose} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <nav aria-label={t.primaryNavigation}>
          <ul className="mobile-nav-list">
            {[{ href: "/", label: () => t.navHome }, ...primaryNavigation, contactNavigation].map((item) => {
              const active = item.href === "/" ? pathname === "/" : isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={active ? "mobile-nav-link active" : "mobile-nav-link"}
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                  >
                    {item.label(t)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mobile-nav-tools">
          <div className="mobile-nav-tool">
            <span className="mobile-nav-tool-label">{t.languageLabel}</span>
            <LanguageSwitcher variant="full" />
          </div>
          <div className="mobile-nav-tool">
            <span className="mobile-nav-tool-label">{t.themeLabel}</span>
            <ThemeSwitcher showLabel />
          </div>
        </div>
      </div>
    </div>
  );
}
