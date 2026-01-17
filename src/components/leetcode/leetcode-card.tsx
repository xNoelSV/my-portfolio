"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

type Props = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  slug: string;
};

const difficultyColors = {
  easy: "text-green-500",
  medium: "text-yellow-500",
  hard: "text-red-500",
};

export default function LeetCodeCard({ title, difficulty, tags, slug }: Props) {
  return (
    <motion.div
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="group"
    >
      <Link
        href={`/leetcode/${slug}`}
        className="block rounded-xl p-4 border hover:shadow-lg dark:hover:shadow-muted/30 transition-all"
      >
        <div className="flex items-center mb-2">
          <Tag
            className={cn(
              "w-6 h-6 opacity-60 mr-1.5",
              difficultyColors[difficulty]
            )}
          />
          <span
            className={cn(
              "text-sm font-medium capitalize",
              difficultyColors[difficulty]
            )}
          >
            {difficulty}
          </span>
          <div className="w-full flex justify-end">
            <span className="text-sm justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              ↗
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">{title}</h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md border px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
