import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Post, NotionBlock } from "@/types/post";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID!;

function toPost(page: PageObjectResponse): Post {
  const props = page.properties;

  const titleProp = props["Title"];
  const title =
    titleProp?.type === "title"
      ? (titleProp.title[0]?.plain_text ?? "")
      : "";

  const categoryProp = props["Category"];
  const category =
    categoryProp?.type === "select"
      ? (categoryProp.select?.name ?? null)
      : null;

  const tagsProp = props["Tags"];
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  const publishedProp = props["Published"];
  const publishedAt =
    publishedProp?.type === "date"
      ? (publishedProp.date?.start ?? null)
      : null;

  const statusProp = props["Status"];
  const status =
    statusProp?.type === "select"
      ? (statusProp.select?.name ?? "")
      : "";

  return { id: page.id, title, category, tags, publishedAt, status };
}

function toNotionBlock(
  block: BlockObjectResponse | PartialBlockObjectResponse
): NotionBlock | null {
  if (!("type" in block)) return null;
  return block as NotionBlock;
}

export async function fetchPages(): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      select: { equals: "발행됨" },
    },
    sorts: [{ property: "Published", direction: "descending" }],
  });

  return response.results
    .filter((p): p is PageObjectResponse => "properties" in p)
    .map(toPost);
}

export async function fetchPageContent(id: string): Promise<NotionBlock[]> {
  const response = await notion.blocks.children.list({ block_id: id });
  return response.results
    .map((block) =>
      toNotionBlock(block as BlockObjectResponse | PartialBlockObjectResponse)
    )
    .filter((b): b is NotionBlock => b !== null);
}

export async function fetchCategories(): Promise<string[]> {
  const pages = await fetchPages();
  const categories = pages
    .map((p) => p.category)
    .filter((c): c is string => c !== null);
  return [...new Set(categories)];
}
