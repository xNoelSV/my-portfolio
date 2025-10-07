"use server";

import type { Metadata } from "next";
import { allProjects } from "contentlayer/generated";
import Balancer from "react-wrap-balancer";
import { Mdx } from "@/components/mdx";
import { siteMetadata } from "@/data/siteMetadata";
import NotFound from "@/app/not-found";
import { formatDate } from "@/lib/utils";
import { getMDXComponent } from "next-contentlayer2/hooks";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const generateStaticParams = async () =>
  // Use the computed `slug` (e.g. "first-post") so the param matches the
  // dynamic route `[slug]` instead of the full `blog/first-post` flattenedPath.
  allProjects.map((project) => ({ slug: project.slug }));

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  // Find by the computed `slug` which matches the route param
  const project = allProjects.find((project) => project.slug === params.slug);
  if (!project) {
    return {
      title: "Project not found",
      description: "The requested project was not found.",
      alternates: {
        canonical: `${siteMetadata.siteUrl}/projects`,
      },
    };
  }

  const ogImage = `${siteMetadata.siteUrl}/og?title=${project.title}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: project.publishedAt,
      url: `${siteMetadata.siteUrl}/projects/${project.slug}`,
      authors: siteMetadata.author,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [ogImage],
    },
  };
}

export default async function Blog(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const project = allProjects.find((project) => project.slug === params.slug);

  if (!project) {
    return <NotFound />;
  }

  const Content = getMDXComponent(project.body.code);

  return (
    <article className="space-y-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to projects
        </Link>
      </Button>

      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          <Balancer>{project.title}</Balancer>
        </h1>
        <p className="text-lg text-muted-foreground">{project.summary}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={project.publishedAt}>
              {formatDate(project.publishedAt)}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{project.readingTime.text}</span>
          </div>
        </div>
      </header>

      <Separator />

      <Mdx code={project.body.code} />
    </article>
  );
}
