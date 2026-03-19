import { clsx } from '@hanlogy/react-web-ui';
import { notFound } from 'next/navigation';
import { ImageUploadProvider } from '@/components/ImageUpload';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { buildS3Url } from '@/helpers/buildS3Url';
import { createSessionManager } from '@/server/auth/createSessionManager';
import { ProfileForm } from './ProfileForm';

export default async function ProfileSettingPage({
  className,
}: {
  className?: string;
}) {
  const profileHelper = new ProfileHelper();
  const { getSession } = await createSessionManager();
  const { handle } = (await getSession()) ?? {};
  if (!handle) {
    return notFound();
  }
  const profile = await profileHelper.getItem({ handle });

  if (!profile) {
    return;
  }

  const { avatar } = profile;

  return (
    <div className={clsx(className)}>
      <ImageUploadProvider defaultImage={buildS3Url(avatar)} folder="profiles">
        <ProfileForm profile={profile} />
      </ImageUploadProvider>
    </div>
  );
}
