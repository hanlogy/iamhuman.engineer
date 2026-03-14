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
import { saveArtifact } from '@/actions/artifacts/saveArtifact';
import { ARTIFACT_TYPES } from '@/definitions';
import type { Artifact, ArtifactLink, ArtifactType } from '@/definitions/types';
import { FilledButton } from '../buttons/FilledButton';
import { SelectField, TextareaField, TextField } from '../form/fields';
import { LinksSection } from './LinksSection';
import { Tabs, type TabName } from './Tabs';

interface FormData {
  title: string;
  type: ArtifactType;
  tags: string;
  publishedAt: string;
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
  artifact,
}: {
  closeDialog: CloseDialogFn;
  artifact?: Artifact;
}) {
  const { register, validate, getValues } = useForm<FormData>();
  const [tabName, setTabName] = useState<TabName>('summary');
  const [links, setLinks] = useState<(ArtifactLink & { id: string })[]>(
    (() => {
      const items = (artifact?.links ?? []).map((e) => ({
        ...e,
        id: crypto.randomUUID(),
      }));

      if (!items.length) {
        items.push({
          id: crypto.randomUUID(),
          title: '',
          url: '',
        });
      }

      return items;
    })()
  );
  const isAdd = !artifact;

  const handleSave = async () => {
    if (!validate()) {
      return false;
    }
    const {
      title,
      type,
      tags: rawTags = '',
      publishedAt,
      summary,
      judgment,
    } = getValues();

    if (!title || !type) {
      return;
    }

    await saveArtifact(artifact?.artifactId, {
      title,
      type,
      tags: rawTags
        .split(',')
        .map((e) => e.trim())
        .filter((e) => Boolean(e)),
      links: links
        .map(({ title, url }) => ({ title: title.trim(), url: url.trim() }))
        .filter(({ url }) => Boolean(url)),
      publishedAt,
      summary,
      judgment,
    });
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
            label="Date"
            controller={register('publishedAt')}
            helper="The date it shipped or was published"
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
            <LinksSection links={links} onChange={setLinks} />
          </div>
          <div className={clsx({ hidden: tabName !== 'judgment' })}>
            <TextareaField
              rows={10}
              label="Judgment"
              controller={register('judgment')}
            />
          </div>
        </div>
      </div>
    </DialogScaffold>
  );
}
