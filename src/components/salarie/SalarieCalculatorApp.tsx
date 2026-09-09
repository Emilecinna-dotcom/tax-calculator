import { useMemo, useState } from 'react';
import { Briefcase, Euro, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrintButton, PrintHeader } from '@/components/shared/PrintButton';
import { SaveButton } from '@/components/shared/SaveButton';
import { HistoryPanel } from '@/components/shared/HistoryPanel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { computeSalaireResult, formatCurrency, formatPercent } from '@/lib/taxCalculations';
import { SALARIE_LABELS, SALARIE_DESCRIPTIONS } from '@/lib/constants';
import { loadHistory, saveHistoryEntry, removeHistoryEntry, type HistoryEntry } from '@/lib/history';
import type { SalarieInputs, SalarieStatut } from '@/types';

const STEP_BADGE =
  'flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground';

export function SalarieCalculatorApp() {
  const [statut, setStatut] = useState<SalarieStatut>('cadre_prive');
  const [grossAnnual, setGrossAnnual] = useState<number>(0);
  const [numberOfParts, setNumberOfParts] = useState<number>(1);
  const [primesPercent, setPrimesPercent] = useState<number>(20);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry<SalarieInputs>[]>(() =>
    loadHistory().filter((e): e is HistoryEntry<SalarieInputs> => e.regime === 'salarie'),
  );

  const result = useMemo(
    () =>
      grossAnnual > 0
        ? computeSalaireResult({ grossAnnual, statut, numberOfParts, primesPercent })
        : null,
    [grossAnnual, statut, numberOfParts, primesPercent],
  );

  function handleSave() {
    if (!result) return;
    const all = saveHistoryEntry<SalarieInputs>({
      regime: 'salarie',
      label: `${SALARIE_LABELS[statut]} · Brut ${formatCurrency(grossAnnual)}`,
      netAfter: result.netAfterTax,
      payload: { grossAnnual, statut, numberOfParts, primesPercent },
    });
    setHistory(all.filter((e): e is HistoryEntry<SalarieInputs> => e.regime === 'salarie'));
  }

  function handleRestore(payload: SalarieInputs) {
    setGrossAnnual(payload.grossAnnual);
    setStatut(payload.statut);
    setNumberOfParts(payload.numberOfParts);
    setPrimesPercent(payload.primesPercent ?? 20);
    setHistoryOpen(false);
  }

  function handleDelete(id: string) {
    const all = removeHistoryEntry(id);
    setHistory(all.filter((e): e is HistoryEntry<SalarieInputs> => e.regime === 'salarie'));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr] print:block">
      {/* ── Colonne gauche : formulaire (masqué à l'impression) ── */}
      <div className="print:hidden space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={STEP_BADGE}>1</span>
              <Briefcase className="size-4 text-muted-foreground" />
              Statut
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="salarie-statut">Situation professionnelle</Label>
              <Select
                value={statut}
                onValueChange={(val) => val && setStatut(val as SalarieStatut)}
              >
                <SelectTrigger id="salarie-statut" className="w-full">
                  <SelectValue>
                    {(val: SalarieStatut | null) => (val ? SALARIE_LABELS[val] : '')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(SALARIE_LABELS) as [SalarieStatut, string][]).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">{SALARIE_DESCRIPTIONS[statut]}</p>
            </div>

            {statut === 'fonctionnaire' && (
              <div className="space-y-1.5">
                <Label htmlFor="salarie-primes">Part de primes dans le brut (%)</Label>
                <Input
                  id="salarie-primes"
                  type="number"
                  min={0}
                  max={100}
                  value={primesPercent}
                  onChange={(e) => setPrimesPercent(Number(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Sert au calcul du RAFP, qui porte sur les primes et non sur le traitement
                  indiciaire. 20% par défaut si vous ne savez pas — regardez le cumul primes
                  de votre fiche de paie pour affiner.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={STEP_BADGE}>2</span>
              <Euro className="size-4 text-muted-foreground" />
              Salaire brut
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="salarie-brut">Salaire brut annuel (€)</Label>
              <div className="relative">
                <Input
                  id="salarie-brut"
                  type="number"
                  inputMode="decimal"
                  placeholder="Ex. 50 000"
                  value={grossAnnual || ''}
                  onChange={(e) => setGrossAnnual(Number(e.target.value) || 0)}
                  className="pr-8"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Le montant brut figure en haut de la fiche de paie, avant toute retenue.
              </p>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label htmlFor="salarie-parts">Nombre de parts fiscales (foyer)</Label>
              <Input
                id="salarie-parts"
                type="number"
                min={1}
                step={0.5}
                value={numberOfParts}
                onChange={(e) => setNumberOfParts(Number(e.target.value) || 1)}
              />
              <p className="text-xs text-muted-foreground">
                1 part (célibataire) · Marié/pacsé = 2, +0,5 par enfant à charge
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Colonne droite : résultats ── */}
      <div className="space-y-4">
        {!result ? (
          <EmptySalarieResults />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  Synthèse
                </span>
                <span className="flex items-center gap-1.5">
                  <HistoryPanel
                    open={historyOpen}
                    onToggle={() => setHistoryOpen((v) => !v)}
                    entries={history}
                    onRestore={handleRestore}
                    onDelete={handleDelete}
                  />
                  <SaveButton onSave={handleSave} />
                  <PrintButton />
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <PrintHeader title="Simulateur Salarié" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatBox label="Brut annuel" value={formatCurrency(result.grossAnnual)} color="text-foreground" />
                <StatBox
                  label="Net avant impôt"
                  value={formatCurrency(result.netBeforeTax)}
                  color="text-blue-600 dark:text-blue-400"
                />
                <StatBox
                  label="Net après impôt"
                  value={formatCurrency(result.netAfterTax)}
                  color="text-green-600 dark:text-green-400"
                />
                <StatBox
                  label="Net / mois"
                  value={formatCurrency(result.monthlyNetAfterTax)}
                  color="text-green-600 dark:text-green-400"
                />
              </div>

              <div className="space-y-2 rounded-lg bg-muted/40 p-3">
                <LineItem label="Cotisations sociales" amount={result.totalCotisations} />
                <LineItem label="Impôt sur le revenu" amount={result.impotRevenu.amount} />
                <div className="my-1 border-t" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Net perçu (après impôt)</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    + {formatCurrency(result.netAfterTax)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBreakdown((v) => !v)}
                className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Détail des cotisations</span>
                {showBreakdown ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>

              {showBreakdown && (
                <div className="space-y-1.5 rounded-lg border p-3">
                  {result.cotisationLines.map((line) => (
                    <div key={line.label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{line.label}</span>
                      <span className="font-medium">{formatCurrency(line.amount)}</span>
                    </div>
                  ))}
                  <Separator className="my-1" />
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Total cotisations</span>
                    <span>{formatCurrency(result.totalCotisations)}</span>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 px-3 py-2">
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Impôt sur le revenu : {formatPercent(result.impotRevenu.rate)} du brut, barème
                  progressif après abattement forfaitaire de 10% pour frais professionnels.
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Statut : {SALARIE_LABELS[statut]} · Estimation indicative, ne remplace pas la
                fiche de paie ni l'avis d'imposition réels (le taux de prélèvement à la source
                personnel peut différer légèrement de ce calcul).
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function EmptySalarieResults() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-8 py-16 text-center">
      <Euro className="mb-4 size-12 text-muted-foreground/30" />
      <p className="text-base font-medium text-muted-foreground">Votre résultat apparaîtra ici</p>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground/70">
        Complétez les étapes 1 et 2 à gauche, choisissez votre statut puis indiquez votre salaire
        brut annuel, pour obtenir une estimation de votre net après impôt.
      </p>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className={`text-base font-semibold leading-tight ${color}`}>{value}</p>
    </div>
  );
}

function LineItem({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-muted-foreground">− {formatCurrency(amount)}</span>
    </div>
  );
}
