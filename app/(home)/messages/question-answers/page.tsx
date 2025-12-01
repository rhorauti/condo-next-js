import Message from '@/components/message/message';

const user = {
  profileSrc: '/avatars/shadcn.jpg',
  profileFallback: 'RH',
  profileUrl: '',
  name: 'Rafael Horauti',
  description: 'Post teste',
  media: null,
  timestamp: new Date(),
  likes: 12,
  isSaved: false,
};

export default function Page() {
  return (
    <>
      <div className="container flex justify-center">
        <Message user={user} />
      </div>
    </>
  );
}
