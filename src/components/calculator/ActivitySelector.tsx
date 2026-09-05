import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ACTIVITY_LABELS, ACTIVITY_DESCRIPTIONS, COTISATIONS_RATES, VERSEMENT_LIBERATOIRE_RATES } from '@/lib/constants';
import { formatPercent } from '@/lib/taxCalculations';
import type { ActivityType } from '@/types';

interface Props {
  value: ActivityType;
  onChange: (value: ActivityType) => void;
}

export function ActivitySelector({ value, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="size-4 text-muted-foreground" />
          Type d'activité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="activity-type">Catégorie fiscale</Label>
          <Select
            value={value}
            onValueChange={(val) => val && onChange(val as ActivityType)}
          >
            <SelectTrigger id="activity-type" className="w-full">
              <SelectValue placeholder="Choisissez votre activité..." />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(ACTIVITY_LABELS) as [ActivityType, string][]).map(
                ([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Description et taux */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-2">
          <p className="text-sm text-muted-foreground">
            {ACTIVITY_DESCRIPTIONS[value]}
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="font-medium text-foreground">
              Cotisations sociales :{' '}
              <span className="text-primary">{formatPercent(COTISATIONS_RATES[value])}</span>
            </span>
            <span className="font-medium text-foreground">
              Versement libératoire :{' '}
              <span className="text-primary">{formatPercent(VERSEMENT_LIBERATOIRE_RATES[value])}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
