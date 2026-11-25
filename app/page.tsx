import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: { absolute: "BAM Engineering Development Group" },
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomePage />;
}
