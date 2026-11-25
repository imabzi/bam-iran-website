import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminPrototypeEnabled } from "@/lib/demo";
import "./admin.css";

// The admin prototype is a UI foundation only: no backend, storage or
// authentication. It is never indexed, and a normal production build does not
// serve it at all (see lib/demo.ts and CMS_INTEGRATION_NOTES.md).
export const metadata: Metadata = {
  title: "Content admin — prototype",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!adminPrototypeEnabled) notFound();
  return children;
}
