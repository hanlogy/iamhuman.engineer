'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { clsx, IconButton } from '@hanlogy/react-web-ui';
import { FullscreenExitSvg, FullscreenSvg } from '@/components/svgs';

export function ArtifactCardExpander({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={clsx(
        'group relative',
        'bg-surface md:rounded-xl',
        'hover:border-accent border-surface border-2 transition-all duration-200',
        { expanded: expanded }
      )}
    >
      {children}
      <div className="absolute right-3 bottom-3 hidden md:block md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
        <IconButton
          size="xsmall"
          className="hover:bg-surface-secondary"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <FullscreenExitSvg /> : <FullscreenSvg />}
        </IconButton>
      </div>
    </div>
  );
}
