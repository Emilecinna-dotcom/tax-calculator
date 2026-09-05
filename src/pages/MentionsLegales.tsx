import { LegalPage } from './LegalPage';
import { MENTIONS_LEGALES } from './legalContent';

export function MentionsLegales() {
  return <LegalPage title="Mentions légales" sections={MENTIONS_LEGALES} />;
}
