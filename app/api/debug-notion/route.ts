import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.NOTION_API_KEY ?? "";
  const dbId = process.env.NOTION_DATABASE_ID ?? "";

  return NextResponse.json({
    keyPrefix: key.slice(0, 10),
    keyLength: key.length,
    dbIdLength: dbId.length,
    dbIdPrefix: dbId.slice(0, 8),
  });
}
