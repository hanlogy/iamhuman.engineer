'use client';

import { IconButton } from '@hanlogy/react-web-ui';
import { ArtifactEditorLauncher } from '@/components/ArtifactEditorLauncher';
import { EditSvg } from '@/components/svgs';
import type { Artifact } from '@/definitions';

export function EditArtifactButton({ artifact }: { artifact: Artifact }) {
  return (
    <ArtifactEditorLauncher artifact={artifact}>
      {({ openDialog }) => {
        return (
          <IconButton
            onClick={openDialog}
            className="hover:bg-surface-secondary"
            size="xsmall"
          >
            <EditSvg />
          </IconButton>
        );
      }}
    </ArtifactEditorLauncher>
  );
}
