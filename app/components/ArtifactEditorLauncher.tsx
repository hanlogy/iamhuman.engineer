'use client';

import type { ReactElement } from 'react';
import { useDialog } from '@hanlogy/react-web-ui';
import type { Artifact } from '@/definitions';
import { ArtifactEditor } from './ArtifactEditor/ArtifactEditor';

export function ArtifactEditorLauncher({
  artifact,
  children,
}: {
  artifact?: Artifact;
  children: (props: { openDialog: () => void }) => ReactElement;
}) {
  const { openDialog } = useDialog();

  const handleOpenDialog = async () => {
    await openDialog(
      ({ closeDialog }) => {
        return <ArtifactEditor artifact={artifact} closeDialog={closeDialog} />;
      },
      {
        closeOnBackdropClick: false,
        closeOnEscape: false,
        withPaddingWhen: 'small',
      }
    );
  };

  return children({ openDialog: handleOpenDialog });
}
