import { PropsWithChildren } from 'react';

export function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h2 className="mb-10 text-center text-3xl font-semibold">{children}</h2>
  );
}
