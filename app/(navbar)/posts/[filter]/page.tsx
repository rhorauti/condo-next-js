import PostsPageClient from './post-page-client';

type PageProps = {
  params: { filter: 'all' | 'my-posts' };
};

export default function Page({ params }: PageProps) {
  return <PostsPageClient filter={params.filter} />;
}
