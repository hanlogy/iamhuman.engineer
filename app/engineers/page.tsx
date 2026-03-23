import Link from 'next/link';
import { getProfile } from '@/actions/profile/getProfile';
import { Avatar } from '@/components/Avatar';

export default async function EngineersPage() {
  const profileResult = await getProfile({ handle: 'zhiguang-chen' });
  const profile = profileResult.success ? profileResult.data : undefined;

  return (
    <div className="py-12">
      <div className="px-4 text-center">
        <div className="text-foreground-muted mb-8 text-xl italic">
          Coming soon...
        </div>
        <p className="text-foreground-secondary mx-auto mt-3 max-w-md leading-relaxed">
          Just one engineer here so far, the one who created this.{' '}
          <span className="font-semibold">
            We are waiting for you to be the next one.
          </span>
        </p>
        {profile && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/zhiguang-chen"
              className="border-border bg-surface hover:bg-surface-secondary flex items-center gap-4 rounded-xl border px-6 py-4 transition-colors"
            >
              <Avatar avatar={profile.avatar} className="h-14 w-14" />
              <div className="text-left">
                <div className="font-medium">{profile.name}</div>
                {profile.location && (
                  <div className="text-foreground-secondary text-sm">
                    {profile.location}
                  </div>
                )}
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
