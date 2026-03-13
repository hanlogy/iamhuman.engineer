import { clsx } from '@hanlogy/react-web-ui';
import { notFound } from 'next/navigation';
import { ImageUploadProvider } from '@/components/ImageUpload';
import { HANDLE_KEY } from '@/definitions';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { createCookieHelper } from '@/server/createCookieHelper';
import { ProfileForm } from './ProfileForm';

export default async function ProfileSettingPage({
  className,
}: {
  className?: string;
}) {
  const profileHelper = new ProfileHelper();
  const { getCookie } = await createCookieHelper();
  const handle = getCookie(HANDLE_KEY);
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
