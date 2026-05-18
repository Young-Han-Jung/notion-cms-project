"use client";

import { useState } from "react";
import type { Post } from "@/types/post";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";

interface PostListSectionProps {
  posts: Post[];
}

export default function PostListSection({ posts }: PostListSectionProps) {
  const [filtered, setFiltered] = useState<Post[]>(posts);

  return (
    <>
      <SearchBar posts={posts} onFilter={setFiltered} />
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
