'use client';

import {
  clsx,
  DropdownMenu,
  IconButton,
  IconWrapper,
} from '@hanlogy/react-web-ui';
import { deleteArtifact } from '@/actions/artifacts/deleteArtifact';
import { DeleteSvg, EditSvg, MoreVertSvg } from '@/components/svgs';
import type { Artifact } from '@/definitions';
import { useOpenArtifactEditor } from '@/hooks/useOpenArtifactEditor';
import { useOpenConfirm } from '@/hooks/useOpenConfirm';

const actionItems = [
  { name: 'edit', label: 'Edit', Icon: EditSvg },
  { name: 'delete', label: 'Delete', Icon: DeleteSvg },
] as const;

type ActionKey = (typeof actionItems)[number]['name'];

export function ActionsButton({ artifact }: { artifact: Artifact }) {
  const { openEditor } = useOpenArtifactEditor({ artifact });
  const { openConfirm } = useOpenConfirm();

  const handleSelect = async (name: ActionKey) => {
    switch (name) {
      case 'edit':
        openEditor();
        return;
      case 'delete':
        const yes = await openConfirm({
          title: 'Delete artifact?',
          message: `"${artifact.title}" will be permanently deleted. This action cannot be undone.`,
          yesLabel: 'Delete',
        });

        if (yes) {
          // TODO: show error info in a dialog when failed
          await deleteArtifact(artifact.artifactId);
        }

        return;
    }
  };

  return (
    <DropdownMenu
      className={clsx(
        'bg-surface border-border min-w-40 rounded-xl border py-2 shadow-lg shadow-gray-200'
      )}
      alignment="bottomRight"
      buttonBuilder={({ show }) => {
        return (
          <IconButton
            onClick={() => show()}
            size="xsmall"
            className="hover:bg-surface-secondary"
          >
            <MoreVertSvg />
          </IconButton>
        );
      }}
      options={actionItems}
      itemBuilder={({ close, item: { name, label, Icon } }) => {
        return (
          <button
            onClick={async () => {
              close();
              await handleSelect(name);
            }}
            className="hover:bg-surface-secondary flex h-10 w-full cursor-pointer items-center px-4 text-left"
          >
            <IconWrapper size="small" className="mr-2">
              <Icon />
            </IconWrapper>
            {label}
          </button>
        );
      }}
      keyBuilder={({ name }) => name}
    />
  );
}
