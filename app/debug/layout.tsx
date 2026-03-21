import { notFound } from 'next/navigation';

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return (
    <>
      <style>{`header, footer { display: none; }`}</style>
      {children}
    </>
  );
}
