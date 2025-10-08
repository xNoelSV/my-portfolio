import { AnimatedBlogList } from "@/components/blog/animated-blog-list";
import { allBlogs } from "contentlayer/generated";
import { ENV } from "@/lib/env";
import { generatePageMetadata } from "@/data/seo";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/pagination/pagination";
import { siteMetadata } from "@/data/siteMetadata";

export const metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Explore my personal blog where I share insights, discoveries, and thoughts on technology and life.",
  canonical: "/blog",
  image: `${siteMetadata.siteUrl}/og?title=Blog`,
});

const isProd = ENV.NODE_ENV === "production";
const BLOG_POSTS_PER_PAGE = 6;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const searchQuery = resolvedSearchParams.search?.toString() || "";
  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) || 1 : 1;

  const blogs = allBlogs.sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const undraftedBlogs = isProd ? blogs.filter((blog) => !blog.draft) : blogs;

  const filteredBlogs = searchQuery
    ? undraftedBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : undraftedBlogs;

  const totalPages = Math.ceil(filteredBlogs.length / BLOG_POSTS_PER_PAGE);
  const currentPage = page > totalPages ? 1 : page;

  const currentPosts = filteredBlogs.slice(
    (currentPage - 1) * BLOG_POSTS_PER_PAGE,
    currentPage * BLOG_POSTS_PER_PAGE
  );

  return (
    <div className="space-y-10">
      <section className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Personal blog where I upload all kinds of discoveries and thoughts
              about myself and technology
            </p>
          </div>
          <SearchInput />
        </div>

        <div className="max-w-4xl">
          <AnimatedBlogList posts={currentPosts} />
        </div>
      </section>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
