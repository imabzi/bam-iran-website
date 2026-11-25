import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/journal/JournalPages";
import { articles, getArticle } from "@/data/journal";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const title = article.title.en ?? article.title.fa ?? "BAM Journal";
  return {
    title,
    description: article.body[0]?.fa?.slice(0, 160),
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      publishedTime: article.publishedAt,
      locale: article.language === "fa" ? "fa_IR" : "en_US",
      images: article.cover ? [{ url: article.cover.src, width: article.cover.width, height: article.cover.height }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return <ArticleDetail article={article} />;
}
