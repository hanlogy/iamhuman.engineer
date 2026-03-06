import { clsx } from '@hanlogy/react-web-ui';
import { CodeSvg, ConditionsSvg, GlobeSvg } from '@/app/components/icons';
import { SectionTitle } from './SectionTitle';

const items = [
  {
    Icon: CodeSvg,
    title: 'For you',
    description:
      'A canonical place to point to. One link that says "this is what I\'ve done."',
  },
  {
    Icon: ConditionsSvg,
    title: 'For discoverers',
    description:
      'Conference organizers, researchers, investors, recruiters, collaborators, anyone looking for engineers defined by their work, not their self-promotion.',
  },
  {
    Icon: GlobeSvg,
    title: 'For the web',
    description: 'A quiet signal of humanity in an era of AI-generated noise.',
  },
];

export function WhyItExists() {
  return (
    <div className="px-4">
      <SectionTitle>Why It Exists</SectionTitle>
      <div
        className={clsx(
          'mx-auto max-w-md',
          'space-y-8',
          'sm:space-y-12',
          'md:max-w-2xl',
          'lg:max-w-3xl lg:space-y-16'
        )}
      >
        {items.map(({ Icon, title, description }) => {
          return (
            <div key={title} className="flex">
              <Icon className="text-foreground-muted w-6" />
              <div className="ml-2 flex-1 sm:ml-4">
                <h3 className="text-foreground-secondary mb-4 text-2xl leading-none font-semibold">
                  {title}
                </h3>
                <p className="leading-relaxed lg:text-lg">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
