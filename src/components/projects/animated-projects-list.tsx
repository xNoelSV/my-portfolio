"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "./project-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { Project } from "contentlayer/generated";
import { useSearchParams } from "next/navigation";

type AnimatedProjectsListProps = {
  projects: Array<
    Pick<Project, "readingTime" | "slug" | "title" | "summary" | "publishedAt">
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
            ? `No articles found matching "${searchQuery}".`
            : "No articles found."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2"
    >
      {projects.map((project, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
