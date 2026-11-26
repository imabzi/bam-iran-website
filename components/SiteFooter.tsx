"use client";

import Link from "next/link";
import { company, contact } from "@/data/company";
import { resolveText } from "@/lib/i18n";
import { siteNavigation } from "@/lib/navigation";
import { useLanguage } from "@/lib/usePreferences";
import { BrandMark } from "./BrandMark";
import { InstagramIcon } from "./Icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Ltr, telHref } from "./Text";

export function SiteFooter() {
  const { language, t } = useLanguage();
  const excerpt = resolveText(company.excerpt, language);
  const address = resolveText(contact.centralOffice.address, language);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label={t.brandLabel}>
            <BrandMark sizes="120px" />
          </Link>
          <p className="footer-name">{t.companyName}</p>
          {excerpt && (
            <p className="footer-excerpt" lang={excerpt.lang}>
              {excerpt.text}
            </p>
          )}
        </div>

        <nav className="footer-column" aria-label={t.footerExplore}>
          <h2 className="footer-heading">{t.footerExplore}</h2>
          <ul>
            {siteNavigation.filter((item) => item.href !== "/").map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label(t)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-column">
          <h2 className="footer-heading">{t.footerContact}</h2>
          <address className="footer-contact">
            {address && <p lang={address.lang}>{address.text}</p>}
            <p>
              {contact.centralOffice.phones.map((phone, index) => (
                <span key={phone}>
                  {index > 0 && <span className="footer-sep" aria-hidden="true"> · </span>}
                  <a href={telHref(phone)}><Ltr>{phone}</Ltr></a>
                </span>
              ))}
            </p>
            <p>
              <a href={`mailto:${contact.centralOffice.email}`}><Ltr>{contact.centralOffice.email}</Ltr></a>
            </p>
            <p className="footer-hours">{t.workingHoursValue}</p>
          </address>
          <a className="footer-social" href={contact.social[0].url} target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
            <span>{t.instagram}</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © <Ltr><span suppressHydrationWarning>{new Date().getFullYear()}</span></Ltr> {t.companyName}. {t.footerRights}
        </p>
        <div className="footer-language">
          <span className="visually-hidden">{t.footerLanguage}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
