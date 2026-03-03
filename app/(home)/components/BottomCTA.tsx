import { LinkButton } from '../../components/LinkButton';
import { SectionTitle } from './SectionTitle';

export function BottomCTA() {
  return (
    <div className="bg-surface-secondary flex-center mt-18 mb-18 flex-col px-4 py-14">
      <SectionTitle>Create a profile that speaks for itself</SectionTitle>
      <div className="w-full max-w-60">
        <LinkButton href="/coming-soon" style="filled">
          Create profile
        </LinkButton>
      </div>
    </div>
  );
}
