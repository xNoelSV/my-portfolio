"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      {/* Mobile floating filter toggle (hidden when panel is open) */}
      {!filtersOpen && (
        <motion.button
          type="button"
          onClick={() => setFiltersOpen(true)}
          onMouseDown={(e) => e.preventDefault()}
          className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center rounded-r-xl rounded-l-none bg-primary text-primary-foreground px-1 py-4 h-32 shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open filters"
        >
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
          <span className="text-sm font-semibold my-1 [writing-mode:vertical-rl]">
            Filters
          </span>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </motion.button>
      )}

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setFiltersOpen(false)}
          >
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-[80vw] max-w-xs bg-background shadow-2xl p-4 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-2xl">Filters</h3>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="rounded-full border px-2 py-1 text-sm hover:bg-muted/60 focus:outline-none"
                >
                  Close
                </button>
              </div>
              <LeetCodeFilters
                selectedDifficulty={selectedDifficulty}
                setSelectedDifficulty={setSelectedDifficulty}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                allTags={allTags}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

        <div className="pl-6 md:pl-0">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {searchQuery || selectedDifficulty || selectedTags.length > 0
                  ? `No LeetCode problems found matching ${
                      searchQuery ? ` "${searchQuery}"` : ""
                    }.`
                  : "No problems found."}
              </p>
            </div>
          ) : (
            <LeetCodeGrid problems={filteredProblems} />
          )}
        </div>
      </div>
    </div>
  );
}
