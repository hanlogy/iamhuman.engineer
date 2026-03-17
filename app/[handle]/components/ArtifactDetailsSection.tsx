'use client';

import { useState } from 'react';
import { clsx } from '@hanlogy/react-web-ui';
import {
  ArtifactDetailsTabs,
  type ArtifactDetailsTabName,
} from '@/components/ArtifactDetailsTabs';
import type { Artifact } from '@/definitions';

export function ArtifactDetailsSection({
  artifact: { links, summary, judgment },
}: {
  artifact: Artifact;
}) {
  const [tab, setTab] = useState<ArtifactDetailsTabName>('summary');

  const showEmpty = (text: string) => (
    <div className="text-foreground-muted text-sm italic">{text}</div>
  );

  return (
    <>
      <div className="mb-4 max-w-xs">
        <ArtifactDetailsTabs selectedTab={tab} onChange={setTab} />
      </div>

      <div className="text-foreground-secondary min-h-12 text-sm leading-relaxed md:text-base">
        <div
          className={clsx({
            hidden: tab !== 'summary',
          })}
        >
          {summary ? summary : showEmpty('Summary is empty')}
        </div>
        <div
          className={clsx({
            hidden: tab !== 'links',
          })}
        >
          {links.length > 0 ? (
            <div className="space-y-3">
              {links.map(({ text, url }) => {
                return (
                  <div className="text-sm" key={url}>
                    <div className="font-medium">{text}</div>
                    <a className="hover:underline" href={url} target="_blank">
                      {url}
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            showEmpty('Links is empty')
          )}
        </div>
        <div
          className={clsx({
            hidden: tab !== 'judgment',
          })}
        >
          {judgment ? judgment : showEmpty('Judgment is empty')}
        </div>
      </div>
    </>
  );
}
