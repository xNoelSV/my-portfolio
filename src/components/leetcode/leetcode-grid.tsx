"use client";

import LeetCodeCard from "./leetcode-card";
import { LeetCode } from "contentlayer/generated";

type Props = {
  problems: LeetCode[];
};

export default function LeetCodeGrid({ problems }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {problems.map((problem) => (
        <LeetCodeCard
          key={problem._id}
          title={problem.title}
          difficulty={problem.difficulty}
          tags={problem.tags}
          url={problem.url}
        />
      ))}
    </div>
  );
}
