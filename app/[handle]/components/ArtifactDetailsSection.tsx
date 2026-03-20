'use client';

import { Fragment, useState } from 'react';
import { clsx } from '@hanlogy/react-web-ui';
import {
  ArtifactDetailsTabs,
  tabItems,
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

  const formatText = (text: string) => (
    <span className="whitespace-pre-line">{text.replace(/\n{2,}/g, '\n')}</span>
  );

  return (
    <>
      <div className="mb-4 max-w-xs group-[.expanded]:hidden">
        <ArtifactDetailsTabs selectedTab={tab} onChange={setTab} />
      </div>

      <div className="min-h-12 text-sm leading-relaxed group-[.expanded]:mt-9 group-[.expanded]:space-y-8 md:text-base">
        {tabItems.map(({ value, label }) => {
          return (
            <div key={value}>
              <div className="mb-2 hidden font-medium group-[.expanded]:block">
                {label}
              </div>
              <div
                className={clsx(
                  {
                    hidden: tab !== value,
                  },
                  'text-foreground-secondary',
                  'group-[.expanded]:block'
                )}
                key={value}
              >
                {value === 'summary' && (
                  <>
                    {summary
                      ? formatText(summary)
                      : showEmpty('Summary is empty')}
                  </>
                )}
                {value === 'judgment' && (
                  <>
                    {judgment
                      ? formatText(judgment)
                      : showEmpty('Judgment is empty')}
                  </>
                )}
                {value === 'links' && (
                  <>
                    {links.length > 0 ? (
                      <div className="space-y-3">
                        {links.map(({ text, url }) => {
                          return (
                            <div className="text-sm break-all" key={url}>
                              <div className="font-medium">{text}</div>
                              <a
                                className="hover:underline"
                                href={url}
                                target="_blank"
                              >
                                {url}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      showEmpty('Links is empty')
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
