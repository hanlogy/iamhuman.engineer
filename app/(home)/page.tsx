import { clsx } from '@hanlogy/react-web-ui';
import { BottomCTA } from './components/BottomCTA';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Manifesto } from './components/Manifesto';
import { WhyItExists } from './components/WhyItExists';

export default function HomePage() {
  return (
    <div
      className={clsx(
        'space-y-24 py-14',
        'sm:space-y-32 sm:py-18',
        'md:space-y-40 md:py-22',
        'xl:space-y-50 xl:py-24'
      )}
    >
      <Hero />
      <Manifesto />
      <HowItWorks />
      <WhyItExists />
      <BottomCTA />
    </div>
  );
}
