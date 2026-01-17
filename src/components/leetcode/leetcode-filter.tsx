"use client";

import { SearchInput } from "@/components/ui/search-input";
import { CustomRadio, CustomCheckbox } from "@/components/ui/radio-checkbox";

type Props = {
  selectedDifficulty: string | null;
  setSelectedDifficulty: (v: string | null) => void;
  selectedTags: string[];
  setSelectedTags: (v: string[]) => void;
  allTags: string[];
};

export default function LeetCodeFilters({
  selectedDifficulty,
  setSelectedDifficulty,
  selectedTags,
  setSelectedTags,
  allTags,
}: Props) {
  const difficulties = ["easy", "medium", "hard"];

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  return (
    <aside className="space-y-6">
      <div>
        <h4 className="font-semibold mb-2 text-lg md:text-sm">
          Search by name
        </h4>
        <SearchInput />
        <div className="flex items-center my-2">
          <h4 className="font-semibold align-middle mr-5 text-lg md:text-sm">
            Difficulty
          </h4>
          <button
            onClick={() => setSelectedDifficulty(null)}
            className={`text-base md:text-sm border px-2 py-1 rounded hover:bg-muted/30 opacity-60 hover:opacity-100 transition-opacity focus:outline-none ${
              !selectedDifficulty ? "invisible" : ""
            }`}
            onMouseDown={(e) => e.preventDefault()}
          >
            X
          </button>
        </div>
        <div className="space-y-2">
          {difficulties.map((d) => (
            <CustomRadio
              key={d}
              id={`difficulty-${d}`}
              name="difficulty"
              checked={selectedDifficulty === d}
              onChange={() => setSelectedDifficulty(d)}
              label={d}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-lg md:text-sm">Type</h4>
        <div className="space-y-2">
          {allTags.map((tag) => (
            <CustomCheckbox
              key={tag}
              id={`tag-${tag}`}
              checked={selectedTags.includes(tag)}
              onChange={() => toggleTag(tag)}
              label={tag}
            />
          ))}
        </div>
      </div>

      {(selectedDifficulty || selectedTags.length > 0) && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDifficulty(null);
              setSelectedTags([]);
            }}
            className="rounded border px-4 py-2 text-base md:text-sm hover:bg-muted/60 focus:outline-none transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </aside>
  );
}
