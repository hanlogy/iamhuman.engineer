import { clsx } from '@hanlogy/react-web-ui';
import { notFound } from 'next/navigation';
import { ImageUploadProvider } from '@/components/ImageUpload';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { getUserFromCookie } from '@/server/userInCookie';
import { ProfileForm } from './ProfileForm';

export default async function ProfileSettingPage({
  className,
}: {
  className?: string;
}) {
  const profileHelper = new ProfileHelper();
  const { handle } = (await getUserFromCookie()) ?? {};
  if (!handle) {
    return notFound();
  }
  const profile = await profileHelper.getItem({ handle });

  if (!profile) {
    return;
  }

  return (
    <div className={clsx(className)}>
      <ImageUploadProvider defaultImage={profile.avatar} folder="profiles">
        <ProfileForm profile={profile} />
      </ImageUploadProvider>
    </div>
  );
}
