"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Code2, ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  slug: string;
};

const difficultyStyles = {
  easy: {
    bg: "bg-green-500/10 dark:bg-green-500/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500/20",
  },
  medium: {
    bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-500/20",
  },
  hard: {
    bg: "bg-red-500/10 dark:bg-red-500/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/20",
  },
};

export default function LeetCodeCard({ title, difficulty, tags, slug }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group h-full"
    >
      <Link
        href={`/leetcode/${slug}`}
        className="flex flex-col h-full rounded-xl p-5 border border-border bg-card hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                difficultyStyles[difficulty].bg,
                difficultyStyles[difficulty].text,
                difficultyStyles[difficulty].border,
              )}
            >
              {difficulty}
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <h3 className="text-base font-semibold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-secondary/50 text-secondary-foreground border border-border/50 hover:bg-secondary transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
