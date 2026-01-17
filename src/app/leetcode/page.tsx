import { allLeetCodes } from "contentlayer/generated";
import LeetCodeContent from "@/components/leetcode/leetcode-content";
import { siteMetadata } from "@/data/siteMetadata";
import { generatePageMetadata } from "@/data/seo";

export const metadata = generatePageMetadata({
  title: "LeetCode",
  description:
    "Discover my collection of LeetCode solutions, showcasing my problem-solving skills and algorithmic thinking through various coding challenges.",
  canonical: "/leetcode",
  image: `${siteMetadata.siteUrl}/og?title=LeetCode Solutions`,
});

export default async function LeetCodePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const searchQuery = resolvedSearchParams.search?.toString() || "";
  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) || 1 : 1;

  const publishedLeetCodes = allLeetCodes.filter((problem) => !problem.draft);
  const allTags = Array.from(
    new Set(publishedLeetCodes.flatMap((p) => p.tags))
  );

  return (
    <div className="space-y-10">
      <section className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              My LeetCode solutions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              This area is dedicated to my LeetCode solutions, where I tackle
              various coding challenges to enhance my problem-solving skills and
              algorithmic thinking.
            </p>
          </div>
        </div>
        <LeetCodeContent
          problems={publishedLeetCodes}
          allTags={allTags}
          searchQuery={searchQuery}
          page={page}
        />
      </section>
    </div>
  );
}
