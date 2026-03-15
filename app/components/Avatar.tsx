import { clsx } from '@hanlogy/react-web-ui';
import Image from 'next/image';
import { buildS3Url } from '@/helpers/buildS3Url';
import { AvatarSvg } from './svgs';

export function Avatar({
  avatar,
  className,
}: {
  avatar?: string;
  className: string;
}) {
  const url = buildS3Url(avatar);

  return url ? (
    <Image
      src={url}
      width={100}
      height={100}
      alt="avatar"
      className={clsx('rounded-full', className)}
    />
  ) : (
    <div
      className={clsx(
        'bg-surface-secondary flex-center rounded-full',
        className
      )}
    >
      <AvatarSvg className="text-foreground-muted/10 w-[80%]" />
    </div>
  );
}
