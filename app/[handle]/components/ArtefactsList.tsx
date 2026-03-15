export function ArtefactsList({ isSelf }: { isSelf: boolean }) {
  return (
    <>
      <div className="text-foreground-muted bg-surface-secondary rounded-xl py-16 text-center">
        <div className="md:text-lg">No artifacts yet.</div>
        {isSelf && (
          <div className="mt-2 text-sm md:text-base">
            Add your first piece of work: a PR, a talk, a case study.
          </div>
        )}
      </div>
    </>
  );
}
