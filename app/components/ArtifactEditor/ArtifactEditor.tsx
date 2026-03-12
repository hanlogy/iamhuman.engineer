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
import { ARTIFACT_TYPES } from '@/definitions';
import { FilledButton } from '../buttons/FilledButton';
import { SelectField, TextareaField, TextField } from '../form/fields';
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

const typeOptions = ARTIFACT_TYPES.map((value) => {
  return {
    value,
    label: {
      code: 'PR / Code / Significant change',
      'case-study': 'Case study',
      design: 'UI/UX design',
      knowledge: 'Talk / Article',
      package: 'Package / Library',
      product: 'Product / Feature',
      research: 'Research / Analysis',
    }[value],
  };
});

export function ArtifactEditor({
  closeDialog,
  id,
}: {
  closeDialog: CloseDialogFn;
  id?: string;
}) {
  const { register, validate, getValues } = useForm<FormData>();
  const [tabName, setTabName] = useState<TabName>('summary');
  const isAdd = !id;

  const handleSave = () => {
    if (!validate()) {
      return false;
    }
  };

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
            <FilledButton onClick={handleSave} className="w-full" size="small">
              Save
            </FilledButton>
          </div>
          <Button onClick={() => closeDialog()}>Close</Button>
        </DialogActionBar>
      }
    >
      <div>
        <div className="space-y-6">
          <TextField
            label="Title"
            controller={register('title', {
              validator: ({ title }) => {
                if (!title?.trim()) {
                  return 'Title is required';
                }
              },
            })}
          />
          <SelectField
            label="Type"
            isOptional
            controller={register('type', {
              validator: ({ type }) => {
                if (!type) {
                  return 'Type is requird';
                }
              },
            })}
            options={typeOptions}
          />
          <TextField
            label="Tags"
            helper="Separate multiple tags tags by commas ( , )"
            controller={register('tags')}
          />
          <TextField
            label="Shipped date"
            controller={register('shipped', {
              validator: ({ shipped }) => {
                if (!shipped) {
                  return 'Shipped date is required';
                }
              },
            })}
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
              controller={register('summary', {
                validator: ({ summary }) => {
                  if (!summary?.trim()) {
                    setTabName('summary');
                    return 'Summary date is required';
                  }
                },
              })}
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
              controller={register('judgment', {
                validator: ({ judgment }) => {
                  if (!judgment) {
                    setTabName('judgment');
                    return 'Judgment date is required';
                  }
                },
              })}
            />
          </div>
        </div>
      </div>
    </DialogScaffold>
  );
}
