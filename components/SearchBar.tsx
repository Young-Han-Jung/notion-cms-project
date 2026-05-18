"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Post } from "@/types/post";

interface SearchBarProps {
  posts: Post[];
  onFilter: (filtered: Post[]) => void;
}

export default function SearchBar({ posts, onFilter }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    const filtered = posts.filter((p) =>
      p.title.toLowerCase().includes(value.toLowerCase())
    );
    onFilter(filtered);
  }

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="글 제목 검색..."
        value={query}
        onChange={handleChange}
        className="pl-9"
      />
    </div>
  );
}
