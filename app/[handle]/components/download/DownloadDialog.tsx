'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  DialogActionBar,
  DialogScaffold,
  DialogTopbar,
} from '@hanlogy/react-web-ui';
import { getArtifacts } from '@/actions/artifacts/getArtifacts';
import { FilledButton } from '@/components/buttons/FilledButton';
import type { Artifact } from '@/definitions';

export function DownloadDialog({
  userId,
  closeDialog,
}: {
  userId: string;
  closeDialog: () => void;
}) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [format, setFormat] = useState<'pdf' | 'json'>('pdf');

  useEffect(() => {
    void getArtifacts({ userId }).then((result) => {
      if (result.success) {
        setArtifacts(result.data);
      }
    });
  }, [userId]);

  const toggleId = (artifactId: string) => {
    setSelectedIds((prev) =>
      prev.includes(artifactId)
        ? prev.filter((id) => id !== artifactId)
        : [...prev, artifactId]
    );
  };

  return (
    <DialogScaffold
      className="max-w-xl rounded-xl bg-white"
      topbar={
        <DialogTopbar className="text-xl font-medium">Download</DialogTopbar>
      }
      bottomBar={
        <DialogActionBar>
          <FilledButton
            size="xsmall"
            className="min-w-20"
            disabled={selectedIds.length === 0}
          >
            Download
          </FilledButton>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActionBar>
      }
    >
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium">Format</p>
        <div className="flex gap-4">
          {(['pdf', 'json'] as const).map((f) => (
            <label key={f} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="format"
                value={f}
                checked={format === f}
                onChange={() => setFormat(f)}
              />
              <span className="text-sm font-medium uppercase">{f}</span>
            </label>
          ))}
        </div>
      </div>
      <p className="text-foreground-secondary mb-4 text-sm">
        Select the artifacts you want to download.
      </p>
      <div className="space-y-2">
        {artifacts.map(({ artifactId, title }) => (
          <label
            key={artifactId}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(artifactId)}
              onChange={() => toggleId(artifactId)}
            />
            <span>{title}</span>
          </label>
        ))}
      </div>
    </DialogScaffold>
  );
}
