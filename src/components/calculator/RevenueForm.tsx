import { Euro, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/taxCalculations';
import type { TaxInputs } from '@/types';

interface Props {
  inputs: TaxInputs;
  caPlafond: number;
  caExceedsPlafond: boolean;
  onChange: (partial: Partial<TaxInputs>) => void;
}

export function RevenueForm({ inputs, caPlafond, caExceedsPlafond, onChange }: Props) {
  const caPercentage = caPlafond > 0 ? Math.min((inputs.revenue / caPlafond) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="size-4 text-muted-foreground" />
          Chiffre d'affaires & options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* CA annuel */}
        <div className="space-y-1.5">
          <Label htmlFor="revenue">Chiffre d'affaires annuel (€ HT)</Label>
          <div className="relative">
            <Input
              id="revenue"
              type="number"
              min={0}
              step={100}
              placeholder="Ex. 45 000"
              value={inputs.revenue || ''}
              onChange={(e) =>
                onChange({ revenue: Math.max(0, parseFloat(e.target.value) || 0) })
              }
              className="pr-8"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              €
            </span>
          </div>

          {/* Barre de progression vers le plafond */}
          {inputs.revenue > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(caPercentage)}% du plafond micro</span>
                <span>Plafond : {formatCurrency(caPlafond)}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${caPercentage}%`,
                    backgroundColor:
                      caPercentage >= 100
                        ? 'var(--destructive)'
                        : caPercentage >= 80
                          ? '#f59e0b'
                          : 'var(--primary)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {caExceedsPlafond && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertDescription className="text-xs">
              Votre CA dépasse le plafond de {formatCurrency(caPlafond)} autorisé en micro-entreprise.
              Vous devrez basculer vers un régime réel.
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Options */}
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Options fiscales
          </p>

          {/* Première année */}
          <OptionRow
            id="first-year"
            label="Première année d'activité"
            description="Exonération de CFE la 1ère année"
            checked={inputs.isFirstYear}
            onCheckedChange={(v) => onChange({ isFirstYear: v })}
          />

          {/* ACRE */}
          <OptionRow
            id="acre"
            label="Bénéficiaire ACRE"
            description="Réduction de 50% sur les cotisations sociales (1ère année)"
            checked={inputs.hasAcre}
            onCheckedChange={(v) => onChange({ hasAcre: v })}
          >
            {inputs.hasAcre && (
              <Alert className="mt-2">
                <Info className="size-4" />
                <AlertDescription className="text-xs">
                  L'ACRE s'applique sur les 12 premiers mois d'activité.
                  Les demandeurs d'emploi, bénéficiaires du RSA et certains jeunes y ont droit.
                </AlertDescription>
              </Alert>
            )}
          </OptionRow>

          {/* Versement libératoire */}
          <OptionRow
            id="versement-liberatoire"
            label="Versement libératoire de l'IR"
            description="Payer l'impôt sur le revenu avec les cotisations (taux fixe)"
            checked={inputs.hasVersementLiberatoire}
            onCheckedChange={(v) => onChange({ hasVersementLiberatoire: v })}
          >
            {inputs.hasVersementLiberatoire && (
              <Alert className="mt-2">
                <Info className="size-4" />
                <AlertDescription className="text-xs">
                  Réservé aux foyers dont le revenu fiscal de référence 2024 ne dépasse pas
                  29 315 € par part. Option à demander avant le 30 septembre pour l'année suivante.
                </AlertDescription>
              </Alert>
            )}
          </OptionRow>

          {/* Nombre de parts */}
          {!inputs.hasVersementLiberatoire && (
            <div className="space-y-1.5">
              <Label htmlFor="parts" className="text-sm font-normal">
                Nombre de parts fiscales (foyer)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="parts"
                  type="number"
                  min={1}
                  max={10}
                  step={0.5}
                  value={inputs.numberOfParts}
                  onChange={(e) =>
                    onChange({ numberOfParts: Math.max(1, parseFloat(e.target.value) || 1) })
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  {inputs.numberOfParts === 1 ? 'part (célibataire)' : 'parts'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Marié/pacsé = 2, +0,5 par enfant à charge
              </p>
            </div>
          )}
        </div>

        {/* Périodicité déclaration */}
        <Separator />
        <div className="space-y-1.5">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Périodicité des déclarations URSSAF
          </Label>
          <div className="flex gap-2">
            {(['monthly', 'quarterly'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onChange({ declarationPeriod: period })}
                className={[
                  'flex-1 rounded-lg border px-3 py-2 text-sm transition-colors',
                  inputs.declarationPeriod === period
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-transparent text-muted-foreground hover:bg-muted',
                ].join(' ')}
              >
                {period === 'monthly' ? 'Mensuelle' : 'Trimestrielle'}
              </button>
            ))}
          </div>
        </div>

        {inputs.revenue > 0 && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              CA mensuel estimé :{' '}
              <span className="font-semibold text-foreground">
                {formatCurrency(inputs.revenue / 12)}
              </span>
              {inputs.declarationPeriod === 'quarterly' && (
                <>
                  {' '}· CA trimestriel :{' '}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(inputs.revenue / 4)}
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface OptionRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: React.ReactNode;
}

function OptionRow({ id, label, description, checked, onCheckedChange, children }: OptionRowProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 flex-1">
          <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>
      {children}
    </div>
  );
}
