import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          {post.category && (
            <Badge variant="secondary" className="w-fit mb-2">
              {post.category}
            </Badge>
          )}
          <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              className="text-xs text-muted-foreground"
            >
              {post.publishedAt.slice(0, 10)}
            </time>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
