import { notFound } from 'next/navigation';
import { getMyProfile } from '@/actions/profile/getMyProfile';
import { LinksForm } from './LinksForm';

export default async function LinksSettingPage() {
  const profileResult = await getMyProfile();

  if (!profileResult.success) {
    return notFound();
  }

  const links = (
    profileResult.data.links?.length ? profileResult.data.links : ['']
  ).map((url: string) => {
    return {
      id: crypto.randomUUID(),
      url,
    };
  });

  return <LinksForm links={links} />;
}
