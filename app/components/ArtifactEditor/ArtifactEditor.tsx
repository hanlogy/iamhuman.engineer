import {
  Button,
  DialogActionBar,
  DialogScaffold,
  DialogTopbar,
  useForm,
  type CloseDialogFn,
} from '@hanlogy/react-web-ui';
import { FilledButton } from '../buttons/FilledButton';
import { TextareaField, TextField } from '../form/fields';

interface FormData {
  title: string;
  type: string;
  tags: string;
  shipped: string;
  summary: string;
  links: string;
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

  const isAdd = !id;

  return (
    <DialogScaffold
      className="max-w-3xl rounded-3xl bg-white"
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
          <TextareaField label="Summary" controller={register('summary')} />
          <TextareaField label="Links" controller={register('links')} />
          <TextareaField label="Judgment" controller={register('judgment')} />
        </div>
      </form>
    </DialogScaffold>
  );
}
