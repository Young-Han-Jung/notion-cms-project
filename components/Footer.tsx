export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} 개인 개발 블로그. All rights reserved.
      </div>
    </footer>
  );
}
