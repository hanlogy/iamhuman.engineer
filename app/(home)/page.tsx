import { clsx } from '@hanlogy/react-web-ui';
import { BottomCTA } from './components/BottomCTA';
import { EngineersCounter } from './components/EngineersCounter';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Manifesto } from './components/Manifesto';
import { WhyItExists } from './components/WhyItExists';

export default function HomePage() {
  return (
    <div
      className={clsx(
        'space-y-18 py-14',
        'sm:space-y-22 sm:py-18',
        'md:space-y-32 md:py-22'
      )}
    >
      <Hero />
      <EngineersCounter />
      <Manifesto />
      <HowItWorks />
      <WhyItExists />
      <BottomCTA />
    </div>
  );
}
