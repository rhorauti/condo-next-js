import Message from '@/components/message/message';

const user = {
  profileUrl: '/avatars/shadcn.jpg',
  profileFallback: 'RH',
  name: 'Rafael Horauti',
  description:
    'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
  mediaList: ['/post.jpg'],
  timestamp: new Date(),
  likes: 12,
  isSaved: true,
};

export default function Page() {
  return (
    <>
      <div className="container flex justify-center">
        <div className="w-[30rem]">
          <Message user={user} />
        </div>
      </div>
    </>
  );
}
