"use client";

import { useTheme } from "next-themes";
import Button from "@/components/ui/button";
import { MoonIcon, SunIcon } from "./icons/icons";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => {
        if (theme === "dark") {
          setTheme("light");
          return;
        }
        setTheme("dark");
      }}
      className="h-9 w-9 px-0!important"
    >
      {theme === "dark" ? (
        <SunIcon height={18} width={18} />
      ) : (
        <MoonIcon height={18} width={18} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
