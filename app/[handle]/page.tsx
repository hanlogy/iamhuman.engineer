import { Suspense } from 'react';
import { clsx } from '@hanlogy/react-web-ui';
import { notFound } from 'next/navigation';
import { Shimmer } from '@/components/Shimmer';
import { ArtifactTagHelper } from '@/dynamodb/ArtifactTagHelper';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { ArtefactsList } from './components/ArtefactsList';
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

  return (
    <div className={clsx('my-6', 'md:mx-auto md:flex md:max-w-5xl md:px-6')}>
      <div className="px-4 md:w-2xs md:px-0 md:pr-6 lg:w-xs lg:pr-8">
        <ProfileSummary tags={tags} profile={profile} />
      </div>
      <div className="md:flex-1">
        <Suspense
          fallback={
            <div className="space-y-6">
              <Shimmer className="h-28 w-full" />
              <Shimmer className="h-28 w-full" />
              <Shimmer className="h-28 w-full" />
            </div>
          }
        >
          <ArtefactsList tags={tags} profile={profile} />
        </Suspense>
      </div>
    </div>
  );
}
