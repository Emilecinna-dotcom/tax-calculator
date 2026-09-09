import { useState } from 'react';
import { Calculator, Briefcase } from 'lucide-react';
import { useTaxCalculator } from '@/hooks/useTaxCalculator';
import { ActivitySelector } from './ActivitySelector';
import { RevenueForm } from './RevenueForm';
import { ExpensesSection } from './ExpensesSection';
import { ResultsSummary } from './ResultsSummary';
import { CotisationsCard } from './CotisationsCard';
import { TVACard } from './TVACard';
import { ImpotCard } from './ImpotCard';
import { CFECard } from './CFECard';
import { SalarieCalculatorApp } from '../salarie/SalarieCalculatorApp';
import { HistoryPanel } from '../shared/HistoryPanel';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/taxCalculations';
import { loadHistory, saveHistoryEntry, removeHistoryEntry, type HistoryEntry } from '@/lib/history';
import type { TaxInputs } from '@/types';

type Regime = 'auto_entrepreneur' | 'salarie';

const REGIME_META: Record<Regime, { title: string; subtitle: string }> = {
  auto_entrepreneur: {
    title: 'Simulateur Auto-Entrepreneur',
    subtitle: 'Charges & impôts 2026 · Taux URSSAF officiels · Données à jour',
  },
  salarie: {
    title: 'Simulateur Salarié',
    subtitle: 'Cadre du privé & fonctionnaire 2026 · Brut → net après impôt',
  },
};

export function TaxCalculatorApp() {
  const [regime, setRegime] = useState<Regime>('auto_entrepreneur');
  const {
    inputs,
    result,
    caPlafond,
    caExceedsPlafond,
    updateInputs,
    addExpense,
    removeExpense,
  } = useTaxCalculator();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry<TaxInputs>[]>(() =>
    loadHistory().filter((e): e is HistoryEntry<TaxInputs> => e.regime === 'auto_entrepreneur'),
  );

  function handleSave() {
    if (!result) return;
    const all = saveHistoryEntry<TaxInputs>({
      regime: 'auto_entrepreneur',
      label: `${ACTIVITY_LABELS[inputs.activityType]} · CA ${formatCurrency(inputs.revenue)}`,
      netAfter: result.netAfterTaxes,
      payload: inputs,
    });
    setHistory(all.filter((e): e is HistoryEntry<TaxInputs> => e.regime === 'auto_entrepreneur'));
  }

  function handleRestore(payload: TaxInputs) {
    updateInputs(payload);
    setHistoryOpen(false);
  }

  function handleDelete(id: string) {
    const all = removeHistoryEntry(id);
    setHistory(all.filter((e): e is HistoryEntry<TaxInputs> => e.regime === 'auto_entrepreneur'));
  }

  const { title, subtitle } = REGIME_META[regime];

  return (
    <div className="min-h-screen bg-background">
      {/* Header : masqué à l'impression, PrintHeader le remplace dans le résultat */}
      <header className="print:hidden sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-backdrop-blur:bg-card/80">
        <div className="mx-auto max-w-6xl px-4 py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <Calculator className="size-5" />
              </div>
              <div>
                <h1 className="text-base font-semibold leading-tight sm:text-lg">{title}</h1>
                <p className="text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
              </div>
            </div>

            {regime === 'auto_entrepreneur' && (
              <HistoryPanel
                open={historyOpen}
                onToggle={() => setHistoryOpen((v) => !v)}
                entries={history}
                onRestore={handleRestore}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Sélecteur de régime : deux situations totalement différentes,
              pas deux options d'un même calcul (auto-entrepreneur = chiffre
              d'affaires ; salarié = salaire brut retenu à la source). */}
          <div className="flex gap-2">
            <RegimeButton
              icon={<Calculator className="size-3.5" />}
              label="Auto-entrepreneur"
              active={regime === 'auto_entrepreneur'}
              onClick={() => setRegime('auto_entrepreneur')}
            />
            <RegimeButton
              icon={<Briefcase className="size-3.5" />}
              label="Salarié"
              active={regime === 'salarie'}
              onClick={() => setRegime('salarie')}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 pt-section pb-6">
        {regime === 'salarie' ? (
          <SalarieCalculatorApp />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[420px_1fr] print:block">

            {/* ── Colonne gauche : formulaire (masqué à l'impression, seul
                le résultat a un sens sur une page imprimée) ── */}
            <div className="print:hidden space-y-4">
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
                    onSave={handleSave}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CotisationsCard cotisations={result.cotisationsSociales} />
                    <ImpotCard
                      impot={result.impotRevenu}
                      revenue={inputs.revenue}
                      activityType={inputs.activityType}
                      numberOfParts={inputs.numberOfParts}
                    />
                  </div>
                  <TVACard tvaInfo={result.tvaInfo} expenses={inputs.expenses} />
                  <CFECard cfeInfo={result.cfeInfo} />
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="print:hidden mt-section border-t">
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

function RegimeButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-transparent text-muted-foreground hover:bg-muted',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyResults() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-8 py-16 text-center">
      <Calculator className="mb-4 size-12 text-muted-foreground/30" />
      <p className="text-base font-medium text-muted-foreground">
        Votre résultat apparaîtra ici
      </p>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground/70">
        Complétez les étapes 1 et 2 à gauche, choisissez votre activité puis
        indiquez votre chiffre d'affaires, pour obtenir une estimation complète
        de vos charges et impôts.
      </p>
    </div>
  );
}
