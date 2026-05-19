import type { Metadata } from "next";
import { fetchPages, fetchCategories } from "@/lib/notion";
import CategoryFilter from "@/components/CategoryFilter";
import PostListSection from "@/components/PostListSection";
import type { Post } from "@/types/post";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "홈",
  description: "Notion을 CMS로 활용한 개인 기술 블로그입니다.",
};

export default async function Home() {
  let posts: Post[] = [];
  let categories: string[] = [];

  try {
    [posts, categories] = await Promise.all([fetchPages(), fetchCategories()]);
  } catch {
    // Notion API 연결 실패 시 빈 목록으로 표시
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">블로그</h1>
      <CategoryFilter categories={categories} />
      <PostListSection posts={posts} />
    </main>
  );
}
