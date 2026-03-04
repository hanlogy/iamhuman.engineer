import { SectionTitle } from './SectionTitle';
import { SimpleCard } from './SimpleCard';
import { ThreeColsGrid } from './ThreeColsGrid';

const items = [
  {
    step: 'Step 1',
    title: 'Add your work',
    description:
      'A PR that mattered. A product you shipped. A package others use. A talk you gave. A case study you wrote.',
  },
  {
    step: 'Step 2',
    title: 'Tell the story',
    description:
      'Not just what you shipped, but why. The constraints. The tradeoffs. What you learned, who you collaborated.',
  },
  {
    step: 'Step 3',
    title: 'Exist',
    description:
      "That's it. No feed to feed. No engagement to chase. Just your work, quietly findable.",
  },
];

export function HowItWorks() {
  return (
    <div className="px-4">
      <SectionTitle>How It Works</SectionTitle>
      <ThreeColsGrid>
        {items.map(({ step, title, description }) => {
          return (
            <SimpleCard
              key={title}
              icon={<div className="text-4xl">{step}</div>}
              title={title}
              description={description}
            />
          );
        })}
      </ThreeColsGrid>
    </div>
  );
}
