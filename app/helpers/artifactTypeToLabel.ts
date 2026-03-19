import { type ArtifactType } from '@/definitions';

export function artifactTypeToLabel(type: ArtifactType): string {
  switch (type) {
    case 'code':
      return 'Code';
    case 'package':
      return 'Packages / Libraries';
    case 'product':
      return 'Product / Feature';
    case 'design':
      return 'UI/UX Design';
    case 'case-study':
      return 'Case Study';
    case 'research':
      return 'Research / Analysis';
    case 'knowledge':
      return 'Talks / Articles';
  }
}
