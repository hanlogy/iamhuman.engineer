'use client';

import { Button, IconButton, useDialog } from '@hanlogy/react-web-ui';
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
    <>
      <div className="hidden sm:contents">
        <Button
          onClick={handleClick}
          size="xsmall"
          className="text-foreground-secondary items-center"
        >
          <DownloadSvg className="w-5" />
          <span className="text-sm">Download</span>
        </Button>
      </div>
      <div className="text-foreground-secondary contents sm:hidden">
        <IconButton
          size="xsmall"
          className="border-border bg-surface hover:bg-surface-secondary border"
          onClick={handleClick}
        >
          <DownloadSvg />
        </IconButton>
      </div>
    </>
  );
}
