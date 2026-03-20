'use client';

import { IconButton, useDialog } from '@hanlogy/react-web-ui';
import { DownloadSvg } from '@/components/svgs';
import { DownloadDialog } from './DownloadDialog';

export function DownloadButton({ userId }: { userId: string }) {
  const { openDialog } = useDialog();

  const handleClick = async () => {
    await openDialog(({ closeDialog }) => {
      return <DownloadDialog userId={userId} closeDialog={closeDialog} />;
    });
  };

  return (
    <IconButton
      className="border-border bg-surface hover:bg-surface-secondary border"
      size="xsmall"
      onClick={handleClick}
    >
      <DownloadSvg />
    </IconButton>
  );
}
