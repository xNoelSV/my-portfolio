"use client";

import { ThemeToggler } from "../theme-toggler";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = {
  "/": {
    name: "Home",
  },
  "/projects": {
    name: "Projects",
  },
  "/blog": {
    name: "My own blog",
  },
  "/leetcode": {
    name: "LeetCode Solutions",
  },
};

export default function Header() {
  let pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  if (pathname.includes("/blog/")) {
    pathname = "/blog";
  }

  return (
    <header className="w-full p-4 mt-5 mb-5">
      <nav className="flex w-full items-center justify-between">
        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          {Object.entries(navItems).map(([path, { name }]) => {
            const isActive = path === pathname;
            return (
              <Link
                key={path}
                href={path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {name}
              </Link>
            );
          })}
        </div>

        {/* Theme toggler */}
        <div className="hidden md:block">
          <ThemeToggler />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col space-y-1"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span className="w-6 h-0.5 bg-foreground"></span>
          <span className="w-6 h-0.5 bg-foreground"></span>
          <span className="w-6 h-0.5 bg-foreground"></span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col p-6">
          <div className="flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="text-2xl"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 space-y-8">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isActive = path === pathname;
              return (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-xl font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {name}
                </Link>
              );
            })}

            <ThemeToggler />
          </div>
        </div>
      )}
    </header>
  );
}
