import { Printer } from 'lucide-react';

/**
 * Imprimer ou enregistrer en PDF (Imprimer → Destination : Enregistrer en
 * PDF, dans toute boîte de dialogue d'impression navigateur — aucune
 * librairie de génération de PDF n'est nécessaire pour un simple export
 * en une page).
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Printer className="size-3.5" />
      Imprimer / PDF
    </button>
  );
}

/**
 * En-tête visible uniquement à l'impression : le header applicatif (sticky,
 * sélecteur de régime) est masqué sur la page imprimée, ce bloc le remplace
 * pour que le PDF garde un minimum de contexte (quel simulateur, quelle date).
 */
export function PrintHeader({ title }: { title: string }) {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="hidden print:block mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-xs text-muted-foreground">Simulation du {today} · Estimation indicative</p>
    </div>
  );
}
