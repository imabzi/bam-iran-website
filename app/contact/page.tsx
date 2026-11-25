import type { Metadata } from "next";
import { ContactPage } from "@/components/company/CompanyPages";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact BAM Engineering Development Group: central office and sales office.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return <ContactPage />;
}
