import { Suspense } from 'react';
import { clsx } from '@hanlogy/react-web-ui';
import { notFound } from 'next/navigation';
import { Shimmer } from '@/components/Shimmer';
import { ArtifactTagHelper } from '@/dynamodb/ArtifactTagHelper';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { getUserFromCookie } from '@/server/userInCookie';
import { ArtefactList } from './components/ArtefactList';
import { ArtefactToolbar } from './components/ArtefactToolbar';
import { ArtifactFilters } from './components/ArtifactFilters';
import { ProfileSummary } from './components/ProfileSummary';

export default async function ProfilePage({ params }: PageProps<'/[handle]'>) {
  const { handle } = await params;
  const profileHelper = new ProfileHelper();
  const profile = await profileHelper.getItem({ handle });
  if (!profile) {
    return notFound();
  }

  const tagHelper = new ArtifactTagHelper();
  const tags = await tagHelper.getTags({ userId: profile.userId }); //.filter((e) => e.count > 0);

  const { userId: myUserId } = (await getUserFromCookie()) ?? {};
  const isSelf = myUserId === profile.userId;

  return (
    <div className={clsx('my-6', 'md:mx-auto md:flex md:max-w-5xl md:px-6')}>
      <div className="px-4 md:w-56 md:px-0 md:pr-6 lg:w-2xs lg:pr-8">
        <div className="mb-8 lg:mb-10">
          <ProfileSummary profile={profile} />
        </div>
        <div className="hidden md:block">
          <ArtifactFilters tags={tags} />
        </div>
      </div>
      <div className="md:flex-1">
        <ArtefactToolbar isSelf={isSelf} />
        <Suspense
          fallback={
            <div className="space-y-6">
              <Shimmer className="h-28 w-full" />
              <Shimmer className="h-28 w-full" />
              <Shimmer className="h-28 w-full" />
            </div>
          }
        >
          <ArtefactList isSelf={isSelf} tags={tags} profile={profile} />
        </Suspense>
      </div>
    </div>
  );
}
