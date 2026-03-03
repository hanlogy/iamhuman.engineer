import { BalanceIcon, NatureIcon, RouteIcon } from '@/app/components/icons';
import { SectionTitle } from './SectionTitle';
import { SimpleCard } from './SimpleCard';

const items = [
  {
    Icon: RouteIcon,
    title: 'We value artifacts',
    description:
      "Claims are forgotten. The work remains. If you built it, you can link it. If you can't link it, it didn't happen.",
  },
  {
    Icon: NatureIcon,
    title: "We don't make noise",
    description:
      'We ship. We document. We move on. Our signal is in what we leave behind, not how often we talk about it.',
  },
  {
    Icon: BalanceIcon,
    title: 'We show judgment',
    description:
      'We explain decisions. Constraints, tradeoffs, and what we learned, alongside what we shipped.',
  },
];

export function Manifesto() {
  return (
    <div className="mt-18 px-4">
      <SectionTitle>This is how you know we&apos;re Human</SectionTitle>
      <div className="space-y-4">
        {items.map(({ Icon, title, description }) => {
          return (
            <SimpleCard
              key={title}
              icon={<Icon className="w-16" />}
              title={title}
              description={description}
            />
          );
        })}
      </div>
    </div>
  );
}
