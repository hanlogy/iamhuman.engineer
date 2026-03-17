'use client';

import { useState } from 'react';
import { clsx, useForm } from '@hanlogy/react-web-ui';
import { useRouter } from 'next/navigation';
import { saveArtifact } from '@/actions/artifacts/saveArtifact';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FilledButton } from '@/components/buttons/FilledButton';
import {
  SelectField,
  TextareaField,
  TextField,
} from '@/components/form/fields';
import { ARTIFACT_TYPES } from '@/definitions';
import type { Artifact, ArtifactLink, ArtifactType } from '@/definitions/types';
import { useAppContext } from '@/state/hooks';
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

export function ArtifactEditor({ artifact }: { artifact?: Artifact }) {
  const router = useRouter();
  const { register, validate, getValues, setFieldError } = useForm<FormData>();
  const [tabName, setTabName] = useState<TabName>('summary');
  const [error, setError] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
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

  const { user } = useAppContext();
  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setError('');
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

    if (!title || !type || !publishedAt) {
      return;
    }

    const tagLabels = rawTags
      .split(',')
      .map((e) => e.trim())
      .filter((e) => Boolean(e));

    if (tagLabels.length > 5) {
      setFieldError('tags', 'Maximum 5 tags allowed');
      return;
    }

    setIsPending(true);
    const { error } = await saveArtifact(artifact?.artifactId, {
      title,
      type,
      tagLabels,
      links: links
        .map(({ title, url }) => ({ title: title.trim(), url: url.trim() }))
        .filter(({ url }) => Boolean(url)),
      publishedAt,
      summary,
      judgment,
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
        <TextField
          defaultValue={artifact?.tags.join(', ')}
          label="Tags"
          helper="Separate multiple tags tags by commas (,)"
          controller={register('tags')}
        />
        <TextField
          defaultValue={artifact?.publishedAt}
          label="Date"
          controller={register('publishedAt', {
            validator: ({ publishedAt }) => {
              if (!publishedAt) {
                return 'Date is required';
              }
            },
          })}
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
            defaultValue={artifact?.summary}
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
            defaultValue={artifact?.judgment}
            rows={10}
            label="Judgment"
            controller={register('judgment')}
          />
        </div>
      </div>
      <div className="flex justify-end">
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
