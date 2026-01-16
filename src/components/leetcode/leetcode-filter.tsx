"use client";

import { SearchInput } from "@/components/ui/search-input";

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
        <h4 className="font-semibold mb-2">Search by name</h4>
        <SearchInput />
        <div className="flex items-center my-2">
          <h4 className="font-semibold align-middle mr-5">Difficulty</h4>
          <button
            onClick={() => setSelectedDifficulty(null)}
            className="text-sm w-10 rounded hover:bg-muted/30 opacity-60 hover:opacity-100 transition-opacity"
          >
            X
          </button>
        </div>
        <div className="space-y-2">
          {difficulties.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="difficulty"
                checked={selectedDifficulty === d}
                onChange={() => setSelectedDifficulty(d)}
              />
              <span className="capitalize">{d}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Type</h4>
        <div className="space-y-2">
          {allTags.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
