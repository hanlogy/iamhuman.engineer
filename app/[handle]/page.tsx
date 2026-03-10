import { notFound } from 'next/navigation';
import { ProfileHelper } from '@/dynamodb/ProfileHelper';

export default async function ProfilePage({ params }: PageProps<'/[handle]'>) {
  const { handle } = await params;
  const profileHelper = new ProfileHelper();
  const profile = await profileHelper.getItem({ handle });
  if (!profile) {
    return notFound();
  }

  return;
}
