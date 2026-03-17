import { clsx, IconWrapper } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { AddSvg } from '@/components/svgs';

export function AddArtifactButton() {
  return (
    <Link
      className={clsx(
        'border-border flex-center text-foreground-secondary h-8 w-8 cursor-pointer rounded-full border',
        'md:w-auto md:px-3'
      )}
      href="/artifact"
    >
      <IconWrapper size="small">
        <AddSvg />
      </IconWrapper>
      <div className="hidden text-sm font-medium md:block">Add</div>
    </Link>
  );
}
