"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "./project-card";
import { Project } from "contentlayer/generated";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type AnimatedProjectsListProps = {
  projects: Array<
    Pick<
      Project,
      | "readingTime"
      | "slug"
      | "title"
      | "summary"
      | "publishedAt"
      | "image"
      | "tags"
      | "githubUrl"
      | "projectUrl"
    >
  >;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export function AnimatedProjectsList({ projects }: AnimatedProjectsListProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          {searchQuery
            ? `No projects found matching "${searchQuery}".`
            : "No projects found."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="columns-1 md:columns-2 gap-6 space-y-6"
    >
      {projects.map((project, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="break-inside-avoid mb-6"
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
