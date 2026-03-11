import { clsx } from '@hanlogy/react-web-ui';
import { ProfileForm } from './ProfileForm';

export default function ProfileSettingPage({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={clsx(className)}>
      <ProfileForm />
    </div>
  );
}
