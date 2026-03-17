import { ArtifactEditor } from './components/ArtifactEditor';

export default async function ArtifactEditorPage({
  searchParams,
}: PageProps<'/artifact'>) {
  const { id } = await searchParams;
  const isAdd = !id;

  return (
    <div className="mx-auto my-8 max-w-2xl px-4">
      <h2 className="mb-8 text-center text-xl font-medium sm:mb-12">
        {isAdd ? 'Add a new' : 'Edit'} artifact
      </h2>
      <ArtifactEditor />
    </div>
  );
}
