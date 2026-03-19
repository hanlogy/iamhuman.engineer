import { clsx } from '@hanlogy/react-web-ui';
import { notFound } from 'next/navigation';
import { getMyProfile } from '@/actions/profile/getMyProfile';
import { ImageUploadProvider } from '@/components/ImageUpload';
import { buildS3Url } from '@/helpers/buildS3Url';
import { ProfileForm } from './ProfileForm';

export default async function ProfileSettingPage({
  className,
}: {
  className?: string;
}) {
  const profileResult = await getMyProfile();

  if (!profileResult.success) {
    return notFound();
  }

  const profile = profileResult.data;

  return (
    <div className={clsx(className)}>
      <ImageUploadProvider
        defaultImage={buildS3Url(profile.avatar)}
        folder="profiles"
      >
        <ProfileForm profile={profile} />
      </ImageUploadProvider>
    </div>
  );
}
