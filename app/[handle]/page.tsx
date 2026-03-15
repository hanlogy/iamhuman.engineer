import { clsx } from '@hanlogy/react-web-ui';
import { notFound } from 'next/navigation';
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

  const { userId } = profile;
  const tagHelper = new ArtifactTagHelper();
  const tags = await tagHelper.getTags({ userId }); //.filter((e) => e.count > 0);

  return (
    <div
      className={clsx('my-6 px-4 sm:px-6', 'md:mx-auto md:flex md:max-w-5xl')}
    >
      <div className="md:w-2xs md:pr-6 lg:w-xs lg:pr-8">
        <ProfileSummary tags={tags} profile={profile} />
      </div>
      <div className="md:flex-1">
        <ArtefactsList />
      </div>
    </div>
  );
}
