import { LegalPage } from './LegalPage';
import { POLITIQUE_CONFIDENTIALITE } from './legalContent';

export function PolitiqueConfidentialite() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      sections={POLITIQUE_CONFIDENTIALITE}
    />
  );
}
