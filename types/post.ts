export interface Post {
  id: string;
  title: string;
  category: string | null;
  tags: string[];
  publishedAt: string | null;
  status: string;
}

export type Category = string;

export interface RichTextItem {
  type: "text";
  text: { content: string; link: { url: string } | null };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
}

export interface ParagraphBlock {
  id: string;
  type: "paragraph";
  paragraph: { rich_text: RichTextItem[] };
}

export interface Heading1Block {
  id: string;
  type: "heading_1";
  heading_1: { rich_text: RichTextItem[] };
}

export interface Heading2Block {
  id: string;
  type: "heading_2";
  heading_2: { rich_text: RichTextItem[] };
}

export interface Heading3Block {
  id: string;
  type: "heading_3";
  heading_3: { rich_text: RichTextItem[] };
}

export interface CodeBlock {
  id: string;
  type: "code";
  code: { rich_text: RichTextItem[]; language: string };
}

export interface ImageBlock {
  id: string;
  type: "image";
  image:
    | { type: "external"; external: { url: string } }
    | { type: "file"; file: { url: string; expiry_time: string } };
}

export interface QuoteBlock {
  id: string;
  type: "quote";
  quote: { rich_text: RichTextItem[] };
}

export interface BulletedListItemBlock {
  id: string;
  type: "bulleted_list_item";
  bulleted_list_item: { rich_text: RichTextItem[] };
}

export interface NumberedListItemBlock {
  id: string;
  type: "numbered_list_item";
  numbered_list_item: { rich_text: RichTextItem[] };
}

export interface UnsupportedBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}

export type KnownNotionBlock =
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | CodeBlock
  | ImageBlock
  | QuoteBlock
  | BulletedListItemBlock
  | NumberedListItemBlock;

export type NotionBlock = KnownNotionBlock | UnsupportedBlock;
