import PostsPageClient from './post-page-client';

type PageProps = {
  params: Promise<{ filter: 'all' | 'my-posts' }>;
};

export default async function Page({ params }: PageProps) {
  const { filter } = await params;

  return <PostsPageClient filter={filter} />;
}
