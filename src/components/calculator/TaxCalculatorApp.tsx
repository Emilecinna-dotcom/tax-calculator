import { Calculator } from 'lucide-react';
import { useTaxCalculator } from '@/hooks/useTaxCalculator';
import { ActivitySelector } from './ActivitySelector';
import { RevenueForm } from './RevenueForm';
import { ExpensesSection } from './ExpensesSection';
import { ResultsSummary } from './ResultsSummary';
import { CotisationsCard } from './CotisationsCard';
import { TVACard } from './TVACard';
import { ImpotCard } from './ImpotCard';
import { CFECard } from './CFECard';
import { ACTIVITY_LABELS } from '@/lib/constants';

export function TaxCalculatorApp() {
  const {
    inputs,
    result,
    caPlafond,
    caExceedsPlafond,
    updateInputs,
    addExpense,
    removeExpense,
  } = useTaxCalculator();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-backdrop-blur:bg-card/80">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
              <Calculator className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight sm:text-lg">
                Simulateur Auto-Entrepreneur
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Charges & impôts 2026 · Taux URSSAF officiels · Données à jour
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">

          {/* ── Colonne gauche : formulaire ── */}
          <div className="space-y-4">
            <ActivitySelector
              value={inputs.activityType}
              onChange={(activityType) => updateInputs({ activityType })}
            />
            <RevenueForm
              inputs={inputs}
              caPlafond={caPlafond}
              caExceedsPlafond={caExceedsPlafond}
              onChange={updateInputs}
            />
            <ExpensesSection
              expenses={inputs.expenses}
              isSubjectToTva={result?.tvaInfo.isSubjectToTva ?? false}
              onAdd={addExpense}
              onRemove={removeExpense}
            />
          </div>

          {/* ── Colonne droite : résultats ── */}
          <div className="space-y-4">
            {!result ? (
              <EmptyResults />
            ) : (
              <>
                <ResultsSummary
                  result={result}
                  activityLabel={ACTIVITY_LABELS[inputs.activityType]}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <CotisationsCard cotisations={result.cotisationsSociales} />
                  <ImpotCard impot={result.impotRevenu} />
                </div>
                <TVACard tvaInfo={result.tvaInfo} expenses={inputs.expenses} />
                <CFECard cfeInfo={result.cfeInfo} />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <p className="text-center text-xs text-muted-foreground">
            Simulateur basé sur les taux URSSAF officiels 2026. Fourni à titre indicatif uniquement.
            Consultez un expert-comptable pour un conseil personnalisé et des calculs précis selon votre situation.
          </p>
          <p className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
            <a href="/mentions-legales" className="hover:underline">
              Mentions légales
            </a>
            <a href="/confidentialite" className="hover:underline">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-8 py-16 text-center">
      <Calculator className="mb-4 size-12 text-muted-foreground/30" />
      <p className="text-base font-medium text-muted-foreground">
        Entrez votre chiffre d'affaires
      </p>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground/70">
        Renseignez votre CA annuel dans le formulaire pour obtenir une estimation
        complète de vos charges et impôts.
      </p>
    </div>
  );
}
