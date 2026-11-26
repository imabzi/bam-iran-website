import type { Metadata } from "next";
import { AwardsPage } from "@/components/awards/Awards";

export const metadata: Metadata = {
  title: "Awards",
  description: "National and international awards received by BAM Engineering Development Group.",
  alternates: { canonical: "/awards" },
};

export default function Page() {
  return <AwardsPage />;
}
