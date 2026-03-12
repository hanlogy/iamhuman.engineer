'use static';

import { clsx, IconWrapper, useDialog } from '@hanlogy/react-web-ui';
import { ArtifactEditor } from '@/components/ArtifactEditor/ArtifactEditor';
import { AddSvg } from '@/components/svgs';

export function AddArtifactbutton() {
  const { openDialog } = useDialog();

  const handleOpenDialog = async () => {
    await openDialog(
      ({ closeDialog }) => {
        return <ArtifactEditor closeDialog={closeDialog} />;
      },
      {
        closeOnBackdropClick: false,
        closeOnEscape: false,
        withPaddingWhen: 'small',
      }
    );
  };

  return (
    <button
      onClick={() => handleOpenDialog()}
      type="button"
      className={clsx(
        'border-border flex-center text-foreground-secondary h-8 w-8 cursor-pointer rounded-full border',
        'md:w-auto md:px-3'
      )}
    >
      <IconWrapper size="small">
        <AddSvg />
      </IconWrapper>
      <div className="hidden text-sm font-medium md:block">Add</div>
    </button>
  );
}
