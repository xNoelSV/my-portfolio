/* export default function ProjectsPage() {
  return (
    <>
      <h1 className="text-6xl font-extrabold md:text-8xl text-center mb-5">
        Not ready yet!
      </h1>
      <p className="mb-4 text-xl font-bold md:text-2xl text-center">
        Coming soon...
      </p>
    </>
  );
}
 */

import { AnimatedBlogList } from "@/components/blog/animated-blog-list";
import { allProjects } from "contentlayer/generated";
import { ENV } from "@/lib/env";
import { generatePageMetadata } from "@/data/seo";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/pagination/pagination";
import { AnimatedProjectsList } from "@/components/projects/animated-projects-list";

export const metadata = generatePageMetadata({
  title: "Projects",
  description: "Find out about my projects",
  canonical: "/projects",
});

const isProd = ENV.NODE_ENV === "production";
const PROJECTS_PER_PAGE = 6;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const searchQuery = resolvedSearchParams.search?.toString() || "";
  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) || 1 : 1;

  const projects = allProjects.sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const undraftedProjects = isProd
    ? projects.filter((project) => !project.draft)
    : projects;

  const filteredProjects = searchQuery
    ? undraftedProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : undraftedProjects;

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const currentPage = page > totalPages ? 1 : page;

  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  return (
    <div className="space-y-10">
      <section className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Projects & Courses
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Personal projects where I showcase my skills and creativity
            </p>
          </div>
          <SearchInput />
        </div>

        <div className="max-w-4xl">
          <AnimatedProjectsList projects={currentProjects} />
        </div>
      </section>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
