'use client';

import { useState } from 'react';
import { clsx, useForm } from '@hanlogy/react-web-ui';
import { useRouter } from 'next/navigation';
import { saveArtifact } from '@/actions/artifacts/saveArtifact';
import {
  ArtifactDetailsTabs,
  type ArtifactDetailsTabName,
} from '@/components/ArtifactDetailsTabs';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useImageUploadContext } from '@/components/ImageUpload/hooks';
import { FilledButton } from '@/components/buttons/FilledButton';
import {
  SelectField,
  TextareaField,
  TextField,
} from '@/components/form/fields';
import { ARTIFACT_TYPES } from '@/definitions';
import type { Artifact, ArtifactLink, ArtifactType } from '@/definitions/types';
import { useAppContext } from '@/state/hooks';
import { ImageSection } from './ImageSection';
import { LinksSection } from './LinksSection';
import { TagsField } from './TagsField';

interface FormData {
  title: string;
  type: ArtifactType;
  releaseDate: string;
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

export function ArtifactEditor({ artifact }: { artifact?: Artifact }) {
  const router = useRouter();
  const { register, validate, getValues } = useForm<FormData>();
  const [tabName, setTabName] = useState<ArtifactDetailsTabName>('summary');
  const [error, setError] = useState<string>('');
  const [tagsError, setTagsError] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const { resolveImage } = useImageUploadContext();
  const [tags, setTags] = useState<string[]>(artifact?.tags.slice() ?? []);
  const [links, setLinks] = useState<(ArtifactLink & { id: string })[]>(
    (() => {
      const items = (artifact?.links ?? []).map((e) => ({
        ...e,
        id: crypto.randomUUID(),
      }));

      if (!items.length) {
        items.push({
          id: crypto.randomUUID(),
          text: '',
          url: '',
        });
      }

      return items;
    })()
  );

  const { user } = useAppContext();
  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setError('');
    setTagsError('');

    if (tags.length > 5) {
      setTagsError('You can add up to 5 tags');
      return;
    }

    if (!validate()) {
      return false;
    }

    const { title, type, releaseDate, summary, judgment } = getValues();

    if (!title || !type || !releaseDate) {
      return;
    }

    setIsPending(true);
    const uodImage = await resolveImage();
    if (!uodImage) {
      return;
    }

    const { error } = await saveArtifact(artifact?.artifactId, {
      title,
      type,
      tagLabels: tags,
      links: links
        .map(({ text, url }) => ({ text: text?.trim(), url: url.trim() }))
        .filter(({ url }) => Boolean(url)),
      releaseDate,
      summary,
      judgment,
      uodImage,
    });
    setIsPending(false);

    if (error) {
      setError('Unknown error');
      return;
    }

    router.push(`/${user.handle}`);
  };

  return (
    <div>
      <div className="space-y-6">
        <TextField
          defaultValue={artifact?.title}
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
          defaultValue={artifact?.type}
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
        <TagsField
          label="Tags"
          value={tags}
          onChange={setTags}
          error={tagsError}
        />
        <TextField
          defaultValue={artifact?.releaseDate}
          label="Date"
          controller={register('releaseDate', {
            validator: ({ releaseDate }) => {
              if (!releaseDate) {
                return 'Date is required';
              }
            },
          })}
          helper="The date it was first released or shipped"
          type="date"
        />
      </div>
      <div className="mx-auto flex max-w-md justify-center pt-12 pb-6">
        <ArtifactDetailsTabs selectedTab={tabName} onChange={setTabName} />
      </div>
      <div className="mb-2">
        <div className={clsx({ hidden: tabName !== 'summary' })}>
          <TextareaField
            defaultValue={artifact?.summary}
            rows={10}
            label="Summary"
            controller={register('summary', {
              validator: ({ summary }) => {
                if (summary && summary.length > 500) {
                  return 'Summary must be 500 characters or less';
                }
              },
            })}
          />
        </div>
        <div className={clsx({ hidden: tabName !== 'links' })}>
          <LinksSection links={links} onChange={setLinks} />
        </div>
        <div className={clsx({ hidden: tabName !== 'judgment' })}>
          <TextareaField
            defaultValue={artifact?.judgment}
            rows={10}
            label="Judgment"
            controller={register('judgment', {
              validator: ({ judgment }) => {
                if (judgment && judgment.length > 500) {
                  return 'Judgment must be 500 characters or less';
                }
              },
            })}
          />
        </div>
      </div>
      <div>
        <ImageSection />
      </div>
      <div className="mt-4 flex justify-end">
        <ErrorMessage message={error} />
        <div className="min-w-32">
          <FilledButton
            disabled={isPending}
            onClick={handleSave}
            className="w-full"
            size="small"
          >
            Save
          </FilledButton>
        </div>
      </div>
    </div>
  );
}
