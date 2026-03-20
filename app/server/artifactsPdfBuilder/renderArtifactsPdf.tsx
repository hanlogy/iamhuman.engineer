import { renderToBuffer } from '@react-pdf/renderer';
import { ArtifactsPdf, type ExportedArtifact } from './ArtifactsPdf';

export function renderArtifactsPdf(
  artifacts: ExportedArtifact[],
  name?: string
): Promise<Buffer> {
  return renderToBuffer(<ArtifactsPdf artifacts={artifacts} name={name} />);
}
