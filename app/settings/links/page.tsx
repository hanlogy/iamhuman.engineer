import { notFound } from 'next/navigation';
import { HANDLE_KEY } from '@/definitions';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';
import { createCookieHelper } from '@/server/createCookieHelper';
import { LinksForm } from './LinksForm';

export default async function LinksSettingPage() {
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

  const links = (profile.links?.length ? profile.links : ['']).map((url) => {
    return {
      id: crypto.randomUUID(),
      url,
    };
  });

  return <LinksForm links={links} />;
}
