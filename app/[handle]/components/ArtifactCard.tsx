import { clsx } from '@hanlogy/react-web-ui';
import Image from 'next/image';
import type { Artifact } from '@/definitions';
import { artifactTypeToLabel } from '@/helpers/artifactTypeToLabel';
import { buildS3Url } from '@/helpers/buildS3Url';
import { ActionsButton } from './ActionsButton';
import { ArtifactDetailsSection } from './ArtifactDetailsSection';

export function ArtifactCard({
  artifact,
  isSelf,
}: {
  artifact: Artifact;
  isSelf: boolean;
}) {
  const { image, type, tags, artifactId, releaseDate, title } = artifact;
  const hasImage = !!image;

  return (
    <div
      key={artifactId}
      className={clsx(
        'bg-surface hover:border-accent border-surface border-2 p-4 transition-all duration-200 md:rounded-xl lg:relative lg:p-6',
        {
          'lg:pl-42': hasImage,
        }
      )}
    >
      <div className="mb-4 flex items-center">
        {image && (
          <Image
            className="top-6 left-6 mr-4 h-14 w-14 overflow-clip rounded-xl object-cover lg:absolute lg:h-32 lg:w-32"
            width={100}
            height={100}
            src={buildS3Url(image)}
            alt="image"
          />
        )}
        <div className="text-foreground-muted items-center lg:flex">
          <div className="text-sm font-semibold">
            {artifactTypeToLabel(type)}
          </div>
          <div className="mx-1 hidden lg:block">•</div>
          <div className="text-sm">Released {releaseDate}</div>
        </div>
      </div>

      <div className="mb-2 flex text-sm font-medium">{tags.join(', ')}</div>
      <div className="mb-6 text-lg leading-tight font-medium">{title}</div>
      <div>
        <ArtifactDetailsSection artifact={artifact} />
      </div>

      {isSelf && (
        <div className="text-foreground-secondary absolute top-2 right-2">
          <ActionsButton artifact={artifact} />
        </div>
      )}
    </div>
  );
}
