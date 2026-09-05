import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatPercent } from '@/lib/taxCalculations';
import type { CotisationsSociales } from '@/types';

interface Props {
  cotisations: CotisationsSociales;
}

export function CotisationsCard({ cotisations }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const breakdownItems = [
    { label: 'Maladie-maternité', value: cotisations.breakdown.malady },
    { label: 'Retraite de base', value: cotisations.breakdown.retraiteBase },
    { label: 'Retraite complémentaire', value: cotisations.breakdown.retraiteComplementaire },
    { label: 'Invalidité-décès', value: cotisations.breakdown.invaliditeDeces },
    { label: 'Allocations familiales', value: cotisations.breakdown.allocationsFamiliales },
    { label: 'Formation professionnelle', value: cotisations.breakdown.formationProfessionnelle },
    { label: 'CSG-CRDS', value: cotisations.breakdown.csgCrds },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground" />
            Cotisations sociales
          </span>
          <Badge variant="secondary" className="text-sm font-semibold">
            {formatCurrency(cotisations.amount)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Taux appliqué</span>
          <span className="text-sm font-semibold">{formatPercent(cotisations.rate)}</span>
        </div>
        <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 px-3 py-2">
          <p className="text-xs text-orange-700 dark:text-orange-300">{cotisations.label}</p>
        </div>

        {/* Détail par composante */}
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
            {breakdownItems.map(({ label, value }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">~ {formatCurrency(value)}</span>
              </div>
            ))}
            <Separator className="my-1" />
            <div className="flex justify-between text-xs font-semibold">
              <span>Total</span>
              <span>{formatCurrency(cotisations.amount)}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              * Décomposition proportionnelle indicative. Le montant total est exact.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Payées directement à l'URSSAF avec chaque déclaration de CA.
          Ces cotisations ouvrent des droits à la retraite, à l'assurance maladie et aux allocations familiales.
        </p>
      </CardContent>
    </Card>
  );
}
