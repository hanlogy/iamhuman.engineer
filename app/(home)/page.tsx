import { BottomCTA } from './components/BottomCTA';
import { EngineersCounter } from './components/EngineersCounter';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Manifesto } from './components/Manifesto';
import { WhyItExists } from './components/WhyItExists';

export default function HomePage() {
  return (
    <>
      <Hero />
      <EngineersCounter />
      <Manifesto />
      <HowItWorks />
      <WhyItExists />
      <BottomCTA />
    </>
  );
}
