import { Suspense } from 'react';
import PostsPageClient from './post-page-client';
import PostPageLoading from '@/app/(navbar)/posts/[filter]/loading';

type PageProps = {
  params: Promise<{ filter: 'all' | 'my-posts' }>;
};

export default async function Page({ params }: PageProps) {
  const { filter } = await params;

  await new Promise((r) => setTimeout(r, 1500));

  return <PostsPageClient filter={filter} />;
}
