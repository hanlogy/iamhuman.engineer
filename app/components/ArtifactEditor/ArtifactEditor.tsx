import { useState } from 'react';
import {
  Button,
  clsx,
  DialogActionBar,
  DialogScaffold,
  DialogTopbar,
  useForm,
  type CloseDialogFn,
} from '@hanlogy/react-web-ui';
import { FilledButton } from '../buttons/FilledButton';
import { TextareaField, TextField } from '../form/fields';
import { LinksSection } from './LinksSection';
import { Tabs, type TabName } from './Tabs';

interface FormData {
  title: string;
  type: string;
  tags: string;
  shipped: string;
  summary: string;
  judgment: string;
}

export function ArtifactEditor({
  closeDialog,
  id,
}: {
  closeDialog: CloseDialogFn;
  id?: string;
}) {
  const { register } = useForm<FormData>();
  const [tabName, setTabName] = useState<TabName>('summary');

  const isAdd = !id;

  return (
    <DialogScaffold
      className={clsx(
        'bg-white',
        'h-full w-full',
        'sm:h-auto sm:max-w-3xl sm:rounded-3xl'
      )}
      topbar={
        <DialogTopbar>
          <h2 className="text-foreground-secondary text-lg font-medium">
            {isAdd ? 'Add new' : 'Edit'} artifact
          </h2>
        </DialogTopbar>
      }
      bottomBar={
        <DialogActionBar>
          <div className="min-w-22">
            <FilledButton className="w-full" size="small">
              Save
            </FilledButton>
          </div>
          <Button onClick={() => closeDialog()}>Close</Button>
        </DialogActionBar>
      }
    >
      <form>
        <div className="space-y-6">
          <TextField label="Title" controller={register('title')} />
          <TextField label="Type" controller={register('type')} />
          <TextField label="Tags" controller={register('tags')} />
          <TextField
            label="Shipped date"
            controller={register('shipped')}
            type="date"
          />
        </div>
        <div className="mx-auto flex max-w-md justify-center pt-12 pb-6">
          <Tabs selectedTab={tabName} onChange={setTabName} />
        </div>
        <div className="mb-10 space-y-6">
          <div className={clsx({ hidden: tabName !== 'summary' })}>
            <TextareaField
              rows={10}
              label="Summary"
              controller={register('summary')}
            />
          </div>
          <div className={clsx({ hidden: tabName !== 'links' })}>
            <LinksSection
              links={[]}
              onChange={(items) => {
                console.log(items);
              }}
            />
          </div>
          <div className={clsx({ hidden: tabName !== 'judgment' })}>
            <TextareaField
              rows={10}
              label="Judgment"
              controller={register('judgment')}
            />
          </div>
        </div>
      </form>
    </DialogScaffold>
  );
}
