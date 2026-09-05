import { Building2, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/taxCalculations';
import type { CFEInfo } from '@/types';

interface Props {
  cfeInfo: CFEInfo;
}

export function CFECard({ cfeInfo }: Props) {
  const { exempt, estimatedMin, estimatedMax, isFirstYear } = cfeInfo;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Building2 className="size-4 text-muted-foreground" />
            CFE – Cotisation Foncière des Entreprises
          </span>
          <Badge variant={exempt ? 'secondary' : 'outline'} className="text-xs">
            {exempt ? 'Exonéré' : 'À prévoir'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exempt ? (
          <div className="flex items-start gap-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3">
            <CheckCircle2 className="size-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {isFirstYear
                  ? 'Exonération 1ère année'
                  : 'Exonération – CA ≤ 5 000 €'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isFirstYear
                  ? 'Vous êtes exonéré de CFE la première année civile d\'activité.'
                  : 'Votre chiffre d\'affaires est inférieur à 5 000 €, vous êtes exonéré de CFE.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs text-muted-foreground">
                Estimation selon le CA (base minimale communale) :
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-lg bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Minimum</p>
                  <p className="text-sm font-semibold">{formatCurrency(estimatedMin)}</p>
                </div>
                <span className="text-muted-foreground">–</span>
                <div className="flex-1 rounded-lg bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Maximum</p>
                  <p className="text-sm font-semibold">{formatCurrency(estimatedMax)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs">
            La CFE est payée une fois par an, généralement en décembre, directement sur
            impots.gouv.fr. Son montant dépend de la commune et de la valeur locative.
            Pour un auto-entrepreneur sans local professionnel, une base minimale est appliquée.
          </AlertDescription>
        </Alert>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p className="font-medium text-foreground text-xs">Points clés :</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Exonération la 1ère année civile d'activité</li>
            <li>Exonération si CA ≤ 5 000 €/an</li>
            <li>Cotisation minimale communale entre 200 € et 2 000 € environ</li>
            <li>Déclaration initiale (formulaire 1447-C) dans les 3 mois de création</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
