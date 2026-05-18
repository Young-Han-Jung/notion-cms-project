import type { Metadata } from "next";
import { fetchPages, fetchCategories } from "@/lib/notion";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await fetchCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return {
    title: `${decoded} 카테고리`,
    description: `${decoded} 카테고리의 글 목록입니다.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);

  const [allPosts, categories] = await Promise.all([
    fetchPages(),
    fetchCategories(),
  ]);

  const posts = allPosts.filter((p) => p.category === decoded);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{decoded}</h1>
      <CategoryFilter categories={categories} />
      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          이 카테고리에 발행된 글이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
