import { CheckCircle2, XCircle, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/taxCalculations';
import type { TVAInfo, Expense } from '@/types';

interface Props {
  tvaInfo: TVAInfo;
  expenses: Expense[];
}

export function TVACard({ tvaInfo, expenses }: Props) {
  const {
    isSubjectToTva,
    threshold,
    toleranceThreshold,
    tvaCollectee,
    tvaDeductible,
    tvaNet,
  } = tvaInfo;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Receipt className="size-4 text-muted-foreground" />
            TVA – Franchise en base
          </span>
          <Badge
            variant={isSubjectToTva ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {isSubjectToTva ? 'Assujetti TVA' : 'Franchise TVA'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Statut */}
        {isSubjectToTva ? (
          <div className="flex items-start gap-3 rounded-lg bg-destructive/5 border border-destructive/20 p-3">
            <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">Vous devez facturer et reverser la TVA</p>
              <p className="text-xs text-muted-foreground">
                Votre CA dépasse le seuil de {formatCurrency(threshold)}.
                Vous devez mentionner la TVA sur vos factures et la reverser à l'administration fiscale.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3">
            <CheckCircle2 className="size-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Franchise en base de TVA active
              </p>
              <p className="text-xs text-muted-foreground">
                Vous ne facturez pas de TVA et ne la reversez pas. Mention obligatoire sur les factures :
                <em className="font-medium"> « TVA non applicable, art. 293 B du CGI »</em>
              </p>
            </div>
          </div>
        )}

        {/* Seuils */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Seuils 2026
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-muted/50 p-2.5 space-y-0.5">
              <p className="text-xs text-muted-foreground">Seuil de franchise</p>
              <p className="font-semibold">{formatCurrency(threshold)}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2.5 space-y-0.5">
              <p className="text-xs text-muted-foreground">Seuil majoré (tolérance)</p>
              <p className="font-semibold">{formatCurrency(toleranceThreshold)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Si votre CA dépasse le seuil majoré en cours d'année, vous devenez redevable de la TVA
            dès le 1er jour du mois de dépassement.
          </p>
        </div>

        {/* Détail TVA si assujetti */}
        {isSubjectToTva && (
          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Calcul TVA
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">TVA collectée (20% du CA)</span>
                <span className="font-medium">{formatCurrency(tvaCollectee)}</span>
              </div>
              {tvaDeductible > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TVA déductible (achats)</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    − {formatCurrency(tvaDeductible)}
                  </span>
                </div>
              )}
              <div className="border-t pt-1.5 flex justify-between text-sm font-semibold">
                <span>{tvaNet < 0 ? 'Crédit de TVA' : 'TVA nette à reverser'}</span>
                <span className={tvaNet < 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}>
                  {tvaNet < 0 ? `+ ${formatCurrency(-tvaNet)}` : formatCurrency(tvaNet)}
                </span>
              </div>
            </div>
            {expenses.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Ajoutez vos achats professionnels dans la section dépenses pour déduire la TVA correspondante.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
