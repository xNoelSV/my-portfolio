"use client";

import { ThemeToggler } from "../theme-toggler";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

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
};

export default function Header() {
  let pathname = usePathname() || "/";
  if (pathname.includes("/blog/")) {
    pathname = "/blog";
  }

  return (
    <>
      <header className="w-full p-4 mt-5 mb-5">
        <nav className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-8">
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
          <ThemeToggler />
        </nav>
      </header>
    </>
  );
}
