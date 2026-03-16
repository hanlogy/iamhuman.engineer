import { clsx, IconWrapper } from '@hanlogy/react-web-ui';
import { AddSvg } from '@/components/svgs';
import { useOpenArtifactEditor } from '@/hooks/useOpenArtifactEditor';

export function AddArtifactButton() {
  const { openEditor } = useOpenArtifactEditor();

  return (
    <button
      onClick={openEditor}
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
