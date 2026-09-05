import { TrendingUp, Wallet, PiggyBank, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/taxCalculations';
import type { TaxResult } from '@/types';

interface Props {
  result: TaxResult;
  activityLabel: string;
}

export function ResultsSummary({ result, activityLabel }: Props) {
  const {
    revenue,
    netAfterTaxes,
    monthlyNet,
    totalTaxes,
    totalTaxRate,
    cotisationsSociales,
    impotRevenu,
    tvaInfo,
  } = result;

  const rawCotisationsPct = revenue > 0 ? cotisationsSociales.amount / revenue : 0;
  const rawImpotPct = revenue > 0 ? impotRevenu.amount / revenue : 0;
  const rawTvaPct = tvaInfo.isSubjectToTva && revenue > 0 ? Math.max(0, tvaInfo.tvaNet) / revenue : 0;
  const rawNetPct = revenue > 0 ? Math.max(0, netAfterTaxes) / revenue : 0;

  const rawTotal = rawCotisationsPct + rawImpotPct + rawTvaPct + rawNetPct;
  const normFactor = rawTotal > 1 ? 1 / rawTotal : 1;

  const cotisationsPct = rawCotisationsPct * normFactor;
  const impotPct = rawImpotPct * normFactor;
  const tvaPct = rawTvaPct * normFactor;
  const netPct = rawNetPct * normFactor;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          Synthèse fiscale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Chiffres clés */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox
            icon={<Wallet className="size-4" />}
            label="CA annuel"
            value={formatCurrency(revenue)}
            color="text-foreground"
          />
          <StatBox
            icon={<PiggyBank className="size-4" />}
            label="Net après charges"
            value={formatCurrency(netAfterTaxes)}
            color="text-green-600 dark:text-green-400"
          />
          <StatBox
            icon={<TrendingUp className="size-4" />}
            label="Taux de charges"
            value={formatPercent(totalTaxRate)}
            color="text-amber-600 dark:text-amber-400"
          />
          <StatBox
            icon={<CalendarDays className="size-4" />}
            label="Net / mois"
            value={formatCurrency(monthlyNet)}
            color="text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* Barre de décomposition */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Décomposition du chiffre d'affaires
          </p>
          <div className="flex h-5 w-full overflow-hidden rounded-full gap-0.5">
            {cotisationsPct > 0 && (
              <div
                className="bg-orange-400 transition-all duration-500"
                style={{ width: `${cotisationsPct * 100}%` }}
                title={`Cotisations sociales : ${formatPercent(cotisationsPct)}`}
              />
            )}
            {impotPct > 0 && (
              <div
                className="bg-purple-400 transition-all duration-500"
                style={{ width: `${impotPct * 100}%` }}
                title={`Impôt sur le revenu : ${formatPercent(impotPct)}`}
              />
            )}
            {tvaPct > 0 && (
              <div
                className="bg-blue-400 transition-all duration-500"
                style={{ width: `${tvaPct * 100}%` }}
                title={`TVA nette : ${formatPercent(tvaPct)}`}
              />
            )}
            {netPct > 0 && (
              <div
                className="bg-green-400 transition-all duration-500 flex-1"
                title={`Net : ${formatPercent(netPct)}`}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <LegendItem color="bg-orange-400" label={`Cotisations ${formatPercent(cotisationsPct)}`} />
            <LegendItem color="bg-purple-400" label={`IR ${formatPercent(impotPct)}`} />
            {tvaInfo.isSubjectToTva && (
              <LegendItem color="bg-blue-400" label={`TVA ${formatPercent(tvaPct)}`} />
            )}
            <LegendItem color="bg-green-400" label={`Net ${formatPercent(netPct)}`} />
          </div>
        </div>

        {/* Tableau récapitulatif */}
        <div className="space-y-2 rounded-lg bg-muted/40 p-3">
          <LineItem label="Cotisations sociales" amount={cotisationsSociales.amount} variant="debit" />
          <LineItem label="Impôt sur le revenu" amount={impotRevenu.amount} variant="debit" />
          {tvaInfo.isSubjectToTva && (
            <LineItem label="TVA à reverser (nette)" amount={tvaInfo.tvaNet} variant="debit" />
          )}
          <div className="my-1 border-t" />
          <LineItem label="Total charges & impôts" amount={totalTaxes} variant="total-debit" />
          <LineItem label="Revenu net disponible" amount={netAfterTaxes} variant="total-credit" />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Activité : {activityLabel} · CFE non incluse (variable selon la commune)
        </p>
      </CardContent>
    </Card>
  );
}

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function StatBox({ icon, label, value, color }: StatBoxProps) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className={`text-base font-semibold leading-tight ${color}`}>{value}</p>
    </div>
  );
}

interface LineItemProps {
  label: string;
  amount: number;
  variant: 'debit' | 'total-debit' | 'total-credit';
}

function LineItem({ label, amount, variant }: LineItemProps) {
  const valueClass =
    variant === 'total-credit'
      ? 'text-green-600 dark:text-green-400 font-semibold'
      : variant === 'total-debit'
        ? 'text-destructive font-semibold'
        : 'text-muted-foreground';

  return (
    <div className="flex items-center justify-between text-sm">
      <span className={variant.startsWith('total') ? 'font-medium text-foreground' : 'text-muted-foreground'}>
        {label}
      </span>
      <span className={valueClass}>
        {variant === 'total-credit' ? '+' : '−'} {formatCurrency(amount)}
      </span>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`size-2.5 rounded-sm ${color}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
