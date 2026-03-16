import { useDialog } from '@hanlogy/react-web-ui';
import { ArtifactEditor } from '@/components/ArtifactEditor';
import type { Artifact } from '@/definitions';

export function useOpenArtifactEditor({
  artifact,
}: { artifact?: Artifact } = {}) {
  const { openDialog } = useDialog();

  return {
    openEditor: async () => {
      await openDialog(
        ({ closeDialog }) => {
          return (
            <ArtifactEditor artifact={artifact} closeDialog={closeDialog} />
          );
        },
        {
          closeOnBackdropClick: false,
          closeOnEscape: false,
          withPaddingWhen: 'small',
        }
      );
    },
  };
}
