import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/lib/taxCalculations';
import type { ImpotRevenu } from '@/types';

interface Props {
  impot: ImpotRevenu;
}

export function ImpotCard({ impot }: Props) {
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
      </CardContent>
    </Card>
  );
}
