import { notFound } from 'next/navigation';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { getUserFromCookie } from '@/server/userInCookie';
import { LinksForm } from './LinksForm';

export default async function LinksSettingPage() {
  const profileHelper = new ProfileHelper();
  const { handle } = (await getUserFromCookie()) ?? {};
  if (!handle) {
    return notFound();
  }

  const profile = await profileHelper.getItem({ handle });

  if (!profile) {
    return;
  }

  const links = (profile.links?.length ? profile.links : ['']).map((url) => {
    return {
      id: crypto.randomUUID(),
      url,
    };
  });

  return <LinksForm links={links} />;
}
