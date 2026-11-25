import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "./ArrowIcon";

export function TextLink({ href, children, external = false, className = "" }: { href: string; children: ReactNode; external?: boolean; className?: string }) {
  const content = (
    <>
      <span>{children}</span>
      <ArrowIcon />
    </>
  );
  return external ? (
    <a href={href} className={`text-link ${className}`} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href} className={`text-link ${className}`}>
      {content}
    </Link>
  );
}

export function SectionHeading({
  id,
  title,
  kicker,
  action,
  level = 2,
}: {
  id?: string;
  title: ReactNode;
  kicker?: ReactNode;
  action?: ReactNode;
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="section-heading">
      <div className="section-heading-copy">
        {kicker && <span className="kicker">{kicker}</span>}
        <Heading id={id} className="section-title">
          {title}
        </Heading>
      </div>
      {action && <div className="section-heading-action">{action}</div>}
    </div>
  );
}

export function DemoBadge({ label, title }: { label: string; title?: string }) {
  return (
    <span className="demo-badge" title={title}>
      {label}
    </span>
  );
}

export function PageIntro({ kicker, title, children }: { kicker?: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-intro container">
      {kicker && <span className="kicker">{kicker}</span>}
      <h1 className="page-title">{title}</h1>
      {children && <div className="page-intro-body">{children}</div>}
    </section>
  );
}
