import { Button, IconButton, IconWrapper } from '@hanlogy/react-web-ui';
import { AddSvg } from '@/components/svgs';

export function AddArtifactbutton() {
  return (
    <>
      <div className="md:hidden">
        <IconButton className="border-border border">
          <AddSvg />
        </IconButton>
      </div>
      <div className="hidden md:block">
        <Button className="border-border border">
          <IconWrapper>
            <AddSvg />
          </IconWrapper>
          Add
        </Button>
      </div>
    </>
  );
}
