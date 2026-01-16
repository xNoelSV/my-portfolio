"use server";

import { allLeetCodes } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx";
import { Metadata } from "next";
import { siteMetadata } from "@/data/siteMetadata";
import { getMDXComponent } from "node_modules/next-contentlayer2/dist/hooks/useMDXComponent";
import NotFound from "@/app/not-found";

/* type Props = {
  params: { slug: string };
};

export default function LeetCodeProblemPage({ params }: Props) {
  const problem = allLeetCodes.find((p) => p.slug === params.slug);

  if (!problem) notFound(); */

export const generateStaticParams = async () =>
  // Use the computed `slug` (e.g. "first-post") so the param matches the
  // dynamic route `[slug]` instead of the full `blog/first-post` flattenedPath.
  allLeetCodes.map((project) => ({ slug: project.slug }));

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  // Find by the computed `slug` which matches the route param
  const leetcodes = allLeetCodes.find(
    (project) => project.slug === params.slug
  );
  if (!leetcodes) {
    return {
      title: "LeetCode problem not found",
      description: "The requested LeetCode problem was not found.",
      alternates: {
        canonical: `${siteMetadata.siteUrl}/leetcode`,
      },
    };
  }

  const ogImage = `${siteMetadata.siteUrl}/og?title=LeetCode: ${leetcodes.title}`;

  return {
    title: leetcodes.title,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/leetcode/${leetcodes.slug}`,
    },
    openGraph: {
      title: leetcodes.title,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      url: `${siteMetadata.siteUrl}/leetcode/${leetcodes.slug}`,
      authors: siteMetadata.author,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: leetcodes.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: leetcodes.title,
      images: [ogImage],
    },
  };
}

export default async function LeetCode(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const leetcode = allLeetCodes.find(
    (LeetCode) => LeetCode.slug === params.slug
  );

  if (!leetcode) {
    return <NotFound />;
  }

  const Content = getMDXComponent(leetcode.body.code);
  return (
    <article className="container max-w-3xl py-12">
      <header className="mb-8">
        <span className="text-sm capitalize opacity-60">
          {leetcode.difficulty}
        </span>
        <h1 className="text-3xl font-bold mt-2">{leetcode.title}</h1>

        <div className="flex flex-wrap gap-2 mt-4">
          {leetcode.tags.map((tag) => (
            <span key={tag} className="rounded-md border px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <Mdx code={leetcode.body.code} />
    </article>
  );
}
