"use client";

import { Check } from "lucide-react";

type RadioProps = {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
};

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
};

export function CustomRadio({
  id,
  name,
  checked,
  onChange,
  label,
}: RadioProps) {
  return (
    <label className="flex items-center gap-3 text-base md:text-sm cursor-pointer">
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-0 h-0 opacity-0 cursor-pointer absolute"
        />
        <div
          className={`w-5 md:w-4 h-5 md:h-4 rounded-full border-2 flex items-center justify-center transition-all ${
            checked
              ? "border-primary bg-primary"
              : "border-muted-foreground bg-background"
          }`}
        >
          {checked && (
            <Check className="w-3.5 md:w-3 h-3.5 md:h-3 text-background" />
          )}
        </div>
      </div>
      <span className="capitalize">{label}</span>
    </label>
  );
}

export function CustomCheckbox({
  id,
  checked,
  onChange,
  label,
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 text-base md:text-sm cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="w-0 h-0 opacity-0 cursor-pointer absolute"
        />
        <div
          className={`w-5 md:w-4 h-5 md:h-4 rounded border-2 flex items-center justify-center transition-all ${
            checked
              ? "border-primary bg-primary"
              : "border-muted-foreground bg-background"
          }`}
        >
          {checked && (
            <Check className="w-3.5 md:w-3 h-3.5 md:h-3 text-background" />
          )}
        </div>
      </div>
      <span>{label}</span>
    </label>
  );
}
