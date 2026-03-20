import { Suspense, cache } from 'react';
import { clsx } from '@hanlogy/react-web-ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtifactTags } from '@/actions/artifacts/getArtifactTags';
import { getProfile } from '@/actions/profile/getProfile';
import { Shimmer } from '@/components/Shimmer';
import { createSessionManager } from '@/server/auth/createSessionManager';
import { ArtifactFilters } from './components/ArtifactFilters';
import { ArtifactList } from './components/ArtifactList';
import { ArtifactToolbar } from './components/ArtifactToolbar';
import { ProfileSummary } from './components/ProfileSummary';

const getCachedProfile = cache(getProfile);

export async function generateMetadata({
  params,
}: PageProps<'/[handle]'>): Promise<Metadata> {
  const { handle } = await params;
  const profileResult = await getCachedProfile({ handle });

  if (!profileResult.success) {
    return {};
  }

  const { name } = profileResult.data;
  const title = `${name ?? 'Profile'} - IAmHuman.Engineer`;

  return { title };
}

export default async function ProfilePage({
  params,
  searchParams,
}: PageProps<'/[handle]'>) {
  const { handle } = await params;
  const { tag } = await searchParams;
  const profileResult = await getCachedProfile({ handle });
  if (!profileResult.success) {
    return notFound();
  }
  const profile = profileResult.data;

  const tagKey = typeof tag === 'string' && tag ? tag : undefined;

  const tagsResult = await getArtifactTags({ userId: profile.userId });
  const tags = tagsResult.success ? tagsResult.data : [];
  const selectedTag = tags.find(({ key }) => key === tagKey);

  const { getSession } = await createSessionManager();
  const { userId: myUserId } = (await getSession()) ?? {};
  const isSelf = myUserId === profile.userId;

  return (
    <div
      className={clsx('mt-6 mb-26', 'md:mx-auto md:flex md:max-w-5xl md:px-6')}
    >
      <div className="px-4 md:w-56 md:px-0 md:pr-6 lg:w-3xs lg:pr-8">
        <div className="mb-8 lg:mb-10">
          <ProfileSummary profile={profile} />
        </div>
        <div className="hidden md:block">
          <ArtifactFilters
            handle={handle}
            tags={tags}
            selectedTag={selectedTag}
          />
        </div>
      </div>
      <div className="md:flex-1">
        <ArtifactToolbar isSelf={isSelf} />
        <Suspense
          fallback={
            <div className="space-y-6">
              <Shimmer className="h-28 w-full" />
              <Shimmer className="h-28 w-full" />
              <Shimmer className="h-28 w-full" />
            </div>
          }
        >
          <ArtifactList
            selectedTag={selectedTag}
            isSelf={isSelf}
            tags={tags}
            profile={profile}
          />
        </Suspense>
      </div>
    </div>
  );
}
