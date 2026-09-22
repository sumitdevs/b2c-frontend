import { NextRequest, NextResponse } from 'next/server';
import { BLOG_ARTICLES } from '@/services/mockData';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return NextResponse.json(
      { success: false, error: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: article,
  });
}
