import { clsx } from '@hanlogy/react-web-ui';

export default function ProfileSettingPage({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={clsx(className)}>
      <div className="bg-surface-secondary h-20 w-20 rounded-full"></div>
      Profile page
    </div>
  );
}
