import Image from "next/image";
import type {
  NotionBlock,
  RichTextItem,
  ParagraphBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  CodeBlock,
  ImageBlock,
  QuoteBlock,
  BulletedListItemBlock,
  NumberedListItemBlock,
} from "@/types/post";

function RichText({ items }: { items: RichTextItem[] }) {
  return (
    <>
      {items.map((item, i) => {
        const { bold, italic, strikethrough, underline, code } = item.annotations;
        let node: React.ReactNode = item.plain_text;

        if (code) node = <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{node}</code>;
        if (bold) node = <strong>{node}</strong>;
        if (italic) node = <em>{node}</em>;
        if (strikethrough) node = <s>{node}</s>;
        if (underline) node = <u>{node}</u>;

        if (item.text.link) {
          node = (
            <a
              href={item.text.link.url}
              className="text-primary underline hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              {node}
            </a>
          );
        }

        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function getImageUrl(block: ImageBlock): string {
  return block.image.type === "external"
    ? block.image.external.url
    : block.image.file.url;
}

function renderBlock(block: NotionBlock): React.ReactNode {
  switch (block.type) {
    case "paragraph": {
      const b = block as ParagraphBlock;
      return (
        <p key={b.id} className="mb-4 leading-7">
          <RichText items={b.paragraph.rich_text} />
        </p>
      );
    }
    case "heading_1": {
      const b = block as Heading1Block;
      return (
        <h1 key={b.id} className="text-3xl font-bold mt-8 mb-4">
          <RichText items={b.heading_1.rich_text} />
        </h1>
      );
    }
    case "heading_2": {
      const b = block as Heading2Block;
      return (
        <h2 key={b.id} className="text-2xl font-semibold mt-6 mb-3">
          <RichText items={b.heading_2.rich_text} />
        </h2>
      );
    }
    case "heading_3": {
      const b = block as Heading3Block;
      return (
        <h3 key={b.id} className="text-xl font-semibold mt-5 mb-2">
          <RichText items={b.heading_3.rich_text} />
        </h3>
      );
    }
    case "code": {
      const b = block as CodeBlock;
      return (
        <div key={b.id} className="mb-4">
          {b.code.language && (
            <div className="bg-muted text-muted-foreground text-xs px-4 py-1 rounded-t border border-b-0">
              {b.code.language}
            </div>
          )}
          <pre className="bg-muted rounded-b rounded-tr p-4 overflow-x-auto text-sm border">
            <code className="font-mono">
              {b.code.rich_text.map((t) => t.plain_text).join("")}
            </code>
          </pre>
        </div>
      );
    }
    case "image": {
      const b = block as ImageBlock;
      const url = getImageUrl(b);
      return (
        <div key={b.id} className="mb-4 relative w-full">
          <Image
            src={url}
            alt="블로그 이미지"
            width={800}
            height={450}
            className="rounded-lg w-full h-auto object-cover"
          />
        </div>
      );
    }
    case "quote": {
      const b = block as QuoteBlock;
      return (
        <blockquote
          key={b.id}
          className="border-l-4 border-primary pl-4 mb-4 italic text-muted-foreground"
        >
          <RichText items={b.quote.rich_text} />
        </blockquote>
      );
    }
    case "bulleted_list_item": {
      const b = block as BulletedListItemBlock;
      return (
        <ul key={b.id} className="list-disc list-inside mb-2 leading-7">
          <li>
            <RichText items={b.bulleted_list_item.rich_text} />
          </li>
        </ul>
      );
    }
    case "numbered_list_item": {
      const b = block as NumberedListItemBlock;
      return (
        <ol key={b.id} className="list-decimal list-inside mb-2 leading-7">
          <li>
            <RichText items={b.numbered_list_item.rich_text} />
          </li>
        </ol>
      );
    }
    default:
      return null;
  }
}

interface NotionRendererProps {
  blocks: NotionBlock[];
}

export default function NotionRenderer({ blocks }: NotionRendererProps) {
  return (
    <div className="prose prose-neutral max-w-none">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}
