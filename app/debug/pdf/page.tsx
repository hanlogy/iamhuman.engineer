'use client';

import dynamic from 'next/dynamic';

const PdfPreview = dynamic(
  () => import('./PdfPreview').then((m) => m.PdfPreview),
  { ssr: false }
);

export default function PdfDebugPage() {
  return <PdfPreview />;
}
