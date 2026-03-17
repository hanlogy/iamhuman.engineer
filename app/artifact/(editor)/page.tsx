import { notFound } from 'next/navigation';
import { getArtifact } from '@/actions/artifacts/getArtifact';
import { ImageUploadProvider } from '@/components/ImageUpload';
import type { Artifact } from '@/definitions';
import { buildS3Url } from '@/helpers/buildS3Url';
import { ArtifactEditor } from './components/ArtifactEditor';

export default async function ArtifactEditorPage({
  searchParams,
}: PageProps<'/artifact'>) {
  const { id } = await searchParams;
  let isAdd: boolean = true;

  let artifact: Artifact | undefined;

  if (typeof id === 'string' && id) {
    isAdd = false;
    const { data, error } = await getArtifact({ artifactId: id });
    if (error) {
      // TODO: Handle the errors
      return notFound();
    }

    artifact = data;
  }

  return (
    <div className="mx-auto my-8 max-w-2xl px-4">
      <h2 className="mb-8 text-center text-xl font-medium sm:mb-12">
        {isAdd ? 'Add a new' : 'Edit'} artifact
      </h2>
      <ImageUploadProvider
        defaultImage={buildS3Url(artifact?.image)}
        folder="artifacts"
      >
        <ArtifactEditor artifact={artifact} />
      </ImageUploadProvider>
    </div>
  );
}
