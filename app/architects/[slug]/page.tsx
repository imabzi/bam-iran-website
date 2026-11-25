import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchitectProfile } from "@/components/architects/ArchitectPages";
import { architects, getArchitect } from "@/data/architects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return architects.map((architect) => ({ slug: architect.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const architect = getArchitect(slug);
  return architect
    ? { title: architect.name.en, alternates: { canonical: `/architects/${architect.id}` } }
    : {};
}

export default async function ArchitectPage({ params }: Props) {
  const { slug } = await params;
  const architect = getArchitect(slug);
  if (!architect) notFound();
  return <ArchitectProfile architect={architect} />;
}
