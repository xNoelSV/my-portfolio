"use client";

import { allLeetCodes } from "contentlayer/generated";
import { useMemo, useState } from "react";
import LeetCodeGrid from "@/components/leetcode/leetcode-grid";
import LeetCodeFilters from "@/components/leetcode/leetcode-filter";
import { SearchInput } from "@/components/ui/search-input";

export default function LeetCodePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allLeetCodes.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredProblems = useMemo(() => {
    return allLeetCodes.filter((problem) => {
      if (selectedDifficulty && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      if (
        selectedTags.length > 0 &&
        !selectedTags.every((tag) => problem.tags.includes(tag))
      ) {
        return false;
      }

      return true;
    });
  }, [selectedDifficulty, selectedTags]);

  return (
    <div className="space-y-10">
      <section className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              My LeetCode solutions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              This area is dedicated to my LeetCode solutions, where I tackle
              various coding challenges to enhance my problem-solving skills and
              algorithmic thinking.
            </p>
          </div>
          <SearchInput />
        </div>
        <div className="container py-12">
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
      </section>
    </div>
  );
}
