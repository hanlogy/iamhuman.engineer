import { clsx, IconWrapper } from '@hanlogy/react-web-ui';
import { ArtifactEditorLauncher } from '@/components/ArtifactEditorLauncher';
import { AddSvg } from '@/components/svgs';

export function AddArtifactButton() {
  return (
    <ArtifactEditorLauncher>
      {({ openDialog }) => {
        return (
          <button
            onClick={openDialog}
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
      }}
    </ArtifactEditorLauncher>
  );
}
