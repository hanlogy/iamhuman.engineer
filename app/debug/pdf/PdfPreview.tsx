'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { ArtifactsPdf } from '@/server/artifactsPdfBuilder/ArtifactsPdf';
import type { ExportedArtifact } from '@/server/artifactsPdfBuilder/ArtifactsPdf';

const MOCK_ARTIFACTS: ExportedArtifact[] = [
  {
    title: 'React Performance Optimization Guide',
    type: 'knowledge',
    releaseDate: '2025-11',
    tags: ['React', 'Performance', 'Frontend'],
    summary:
      'A comprehensive guide covering memoization, code splitting, and render optimization techniques for large React applications.',
    judgment:
      'This ended up being one of the most referenced internal docs. The section on useMemo trade-offs saved us from several premature optimizations.',
    links: [
      { text: 'GitHub Repo', url: 'https://github.com/example/perf-guide' },
      { url: 'https://react.dev/reference/react/useMemo' },
    ],
  },
  {
    title: 'Design System v2',
    type: 'design',
    releaseDate: '2025-08',
    tags: ['Design System', 'Figma'],
    summary:
      'Complete redesign of the component library with a new token system, dark mode support, and accessibility improvements.',
    judgment: '',
    links: [],
  },
];

export function PdfPreview() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <PDFViewer width="100%" height="100%">
        <ArtifactsPdf artifacts={MOCK_ARTIFACTS} name="Debug User" />
      </PDFViewer>
    </div>
  );
}
