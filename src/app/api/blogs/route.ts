import { NextRequest, NextResponse } from 'next/server';
import { BLOG_ARTICLES } from '@/services/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');

  let filtered = [...BLOG_ARTICLES];

  if (category && category !== 'All') {
    filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
  }

  if (tag) {
    filtered = filtered.filter((b) =>
      b.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}
