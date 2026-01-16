"use client";

import { useMemo, useState } from "react";
import { LeetCode } from "contentlayer/generated";
import LeetCodeGrid from "@/components/leetcode/leetcode-grid";
import LeetCodeFilters from "@/components/leetcode/leetcode-filter";

type Props = {
  problems: LeetCode[];
  allTags: string[];
  searchQuery?: string;
  page?: number;
};

export default function LeetCodeContent({
  problems,
  allTags,
  searchQuery = "",
  page = 1,
}: Props) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      if (selectedDifficulty && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      if (
        selectedTags.length > 0 &&
        !selectedTags.every((tag) => problem.tags.includes(tag))
      ) {
        return false;
      }

      if (
        searchQuery &&
        !problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [selectedDifficulty, selectedTags, problems, searchQuery]);

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
        <div className="sticky top-24 self-start hidden md:block">
          <LeetCodeFilters
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            allTags={allTags}
          />
        </div>

        <div>
          <LeetCodeGrid problems={filteredProblems} />
        </div>
      </div>
    </div>
  );
}
