"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname();

  const isAllSelected = pathname === "/";
  const selectedCategory = pathname.startsWith("/category/")
    ? decodeURIComponent(pathname.split("/category/")[1])
    : null;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/"
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
          isAllSelected
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
        )}
      >
        전체
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/category/${encodeURIComponent(category)}`}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
            selectedCategory === category
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
          )}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
