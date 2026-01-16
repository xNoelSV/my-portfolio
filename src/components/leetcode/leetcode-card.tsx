"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  url: string;
};

const difficultyColors = {
  easy: "text-green-500",
  medium: "text-yellow-500",
  hard: "text-red-500",
};

export default function LeetCodeCard({ title, difficulty, tags, url }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Link
        href={url}
        className="block rounded-xl p-4 hover:shadow-lg dark:hover:shadow-muted/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              "text-sm font-medium capitalize",
              difficultyColors[difficulty]
            )}
          >
            {difficulty}
          </span>
          <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            ↗
          </span>
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
