import { ReactNode } from 'react';

export function SimpleCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <div className="bg-surface rounded-xl px-4 py-8">
      <div className="text-foreground-muted mb-6">{icon}</div>
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      <div>{description}</div>
    </div>
  );
}
