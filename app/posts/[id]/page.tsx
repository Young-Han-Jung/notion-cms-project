import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPages, fetchPageContent } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const pages = await fetchPages();
  return pages.map((page) => ({ id: page.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pages = await fetchPages();
  const post = pages.find((p) => p.id === id);

  if (!post) return {};

  return {
    title: post.title,
    description: `${post.category ?? ""} ${post.tags.join(", ")}`.trim(),
    openGraph: {
      title: post.title,
      description: `${post.category ?? ""} ${post.tags.join(", ")}`.trim(),
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const [pages, blocks] = await Promise.all([
    fetchPages(),
    fetchPageContent(id),
  ]);

  const postIndex = pages.findIndex((p) => p.id === id);
  if (postIndex === -1) notFound();

  const post = pages[postIndex];
  const prevPost = postIndex < pages.length - 1 ? pages[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? pages[postIndex - 1] : null;

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
      <article>
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.category && (
              <Badge variant="secondary">{post.category}</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{post.publishedAt.slice(0, 10)}</time>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        <NotionRenderer blocks={blocks} />
      </article>

      <nav className="mt-12 pt-6 border-t grid grid-cols-2 gap-4">
        <div>
          {prevPost && (
            <Link
              href={`/posts/${prevPost.id}`}
              className="group flex flex-col gap-1 text-sm"
            >
              <span className="text-muted-foreground">← 이전 글</span>
              <span className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {nextPost && (
            <Link
              href={`/posts/${nextPost.id}`}
              className="group flex flex-col gap-1 text-sm items-end"
            >
              <span className="text-muted-foreground">다음 글 →</span>
              <span className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
