import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          개인 개발 블로그
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            홈
          </Link>
        </nav>
      </div>
    </header>
  );
}
