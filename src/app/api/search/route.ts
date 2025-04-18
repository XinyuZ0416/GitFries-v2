import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`http://localhost:8108/collections/issues/documents/search?q=${encodeURIComponent(query)}&query_by=title&sort_by=time:desc`, {
      headers: {
        'X-TYPESENSE-API-KEY': process.env.TYPESENSE_SEARCH_API_KEY!
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Search failed: ", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}