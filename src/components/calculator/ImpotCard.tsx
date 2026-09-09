import { FileText, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { computeImpotComparaison, formatCurrency, formatPercent } from '@/lib/taxCalculations';
import type { ActivityType, ImpotRevenu } from '@/types';

interface Props {
  impot: ImpotRevenu;
  revenue: number;
  activityType: ActivityType;
  numberOfParts: number;
}

export function ImpotCard({ impot, revenue, activityType, numberOfParts }: Props) {
  const comparaison = computeImpotComparaison(revenue, activityType, numberOfParts);
  const ecart = Math.abs(comparaison.liberatoire - comparaison.bareme);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            Impôt sur le revenu
          </span>
          <Badge variant="secondary" className="text-sm font-semibold">
            {formatCurrency(impot.amount)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Taux effectif estimé</span>
          <span className="text-sm font-semibold">{formatPercent(impot.rate)}</span>
        </div>

        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 px-3 py-2">
          <p className="text-xs text-purple-700 dark:text-purple-300">{impot.label}</p>
        </div>

        {impot.isVersementLiberatoire ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Le versement libératoire est réglé en même temps que les cotisations sociales
              à chaque déclaration URSSAF. Il libère définitivement de l'impôt sur le revenu
              pour ces revenus.
            </p>
            <div className="rounded-lg border px-3 py-2 text-xs space-y-1">
              <p className="font-medium text-foreground">Avantage du versement libératoire :</p>
              <p className="text-muted-foreground">
                Le taux fixe est prévisible et souvent avantageux pour les faibles revenus.
                Il n'y a pas de régularisation en fin d'année.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Sans versement libératoire, vous déclarez vos revenus via la déclaration annuelle
              de revenus (formulaire 2042-C PRO). L'impôt est calculé selon le barème progressif
              après abattement forfaitaire.
            </p>
            <div className="rounded-lg border px-3 py-2 text-xs space-y-1">
              <p className="font-medium text-foreground">Barème progressif 2026 :</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground mt-1">
                <span>0 – 11 497 €</span><span>0 %</span>
                <span>11 497 – 29 315 €</span><span>11 %</span>
                <span>29 315 – 83 823 €</span><span>30 %</span>
                <span>83 823 – 180 294 €</span><span>41 %</span>
                <span>Au-delà</span><span>45 %</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              * Estimation pour 1 part. Le montant réel dépend de vos autres revenus et charges de famille.
            </p>
          </div>
        )}

        {/* Comparateur : les deux montants, indépendamment de l'option cochée
            ci-dessus, pour aider au choix plutôt que de forcer à basculer le
            réglage pour voir l'autre chiffre. */}
        {revenue > 0 && (
          <div className="space-y-2 rounded-lg border p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Scale className="size-3.5" />
              Comparateur des deux modes
            </p>
            <ComparaisonRow
              label="Versement libératoire"
              amount={comparaison.liberatoire}
              isBest={comparaison.recommande === 'liberatoire'}
            />
            <ComparaisonRow
              label="Barème progressif"
              amount={comparaison.bareme}
              isBest={comparaison.recommande === 'bareme'}
            />
            {ecart > 0 && (
              <p className="text-xs text-muted-foreground">
                Écart : {formatCurrency(ecart)} en faveur du{' '}
                {comparaison.recommande === 'liberatoire' ? 'versement libératoire' : 'barème progressif'}.
              </p>
            )}
            <p className="text-[10px] text-muted-foreground">
              * Le versement libératoire n'est éligible qu'en dessous d'un plafond de revenu
              fiscal de référence du foyer (n-2), non demandé ici.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ComparaisonRow({
  label,
  amount,
  isBest,
}: {
  label: string;
  amount: number;
  isBest: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={isBest ? 'font-medium text-foreground' : 'text-muted-foreground'}>
        {label}
        {isBest && (
          <span className="ml-1.5 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
            plus avantageux
          </span>
        )}
      </span>
      <span className={isBest ? 'font-semibold text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
        {formatCurrency(amount)}
      </span>
    </div>
  );
}
