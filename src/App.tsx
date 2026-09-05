import type { ReactElement } from 'react';
import { TaxCalculatorApp } from './components/calculator/TaxCalculatorApp';
import { MentionsLegales } from './pages/MentionsLegales';
import { PolitiqueConfidentialite } from './pages/PolitiqueConfidentialite';

// Pas de librairie de routing : seulement 2 pages statiques en plus du
// simulateur, un simple aiguillage par chemin suffit et reste léger (KISS).
const LEGAL_PAGES: Record<string, () => ReactElement> = {
  '/mentions-legales': MentionsLegales,
  '/confidentialite': PolitiqueConfidentialite,
};

export default function App() {
  const LegalPageComponent = LEGAL_PAGES[window.location.pathname];
  if (LegalPageComponent) return <LegalPageComponent />;

  return <TaxCalculatorApp />;
}
