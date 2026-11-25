import type { MetadataRoute } from "next";
import { architects } from "@/data/architects";
import { publishedEvents } from "@/data/events";
import { articles } from "@/data/journal";
import { projects } from "@/data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bamgroup.ir";

// Public, production content only: demo events and the admin prototype are never listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/projects",
    "/architects",
    "/events",
    "/journal",
    "/about",
    "/contact",
    ...projects.map((project) => `/projects/${project.slug}`),
    ...architects.map((architect) => `/architects/${architect.id}`),
    ...publishedEvents.filter((event) => event.publication === "published").map((event) => `/events/${event.slug}`),
    ...articles.map((article) => `/journal/${article.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
