"use client";

import { motion } from "framer-motion";
import LeetCodeCard from "./leetcode-card";
import { LeetCode } from "contentlayer/generated";

type Props = {
  problems: LeetCode[];
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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

export default function LeetCodeGrid({ problems }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-5 sm:grid-cols-1 md:grid-cols-2"
    >
      {problems.map((problem) => (
        <motion.div key={problem._id} variants={itemVariants}>
          <LeetCodeCard
            title={problem.title}
            difficulty={problem.difficulty}
            tags={problem.tags}
            slug={problem.slug}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
