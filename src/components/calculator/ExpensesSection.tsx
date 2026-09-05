import { useState } from 'react';
import { Plus, Trash2, Receipt, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EXPENSE_CATEGORY_LABELS, TVA_RATE_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/taxCalculations';
import type { Expense, ExpenseCategory, TvaRate } from '@/types';

interface Props {
  expenses: Expense[];
  isSubjectToTva: boolean;
  onAdd: (expense: Expense) => void;
  onRemove: (id: string) => void;
}

interface ExpenseFormState {
  label: string;
  amount: string;
  category: ExpenseCategory;
  tvaRate: TvaRate;
}

const INITIAL_FORM: ExpenseFormState = {
  label: '',
  amount: '',
  category: 'materiel',
  tvaRate: 20,
};

export function ExpensesSection({ expenses, isSubjectToTva, onAdd, onRemove }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ExpenseFormState>(INITIAL_FORM);
  const [error, setError] = useState('');

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalTvaDeductible = isSubjectToTva
    ? expenses.reduce((sum, e) => sum + e.amount * (e.tvaRate / 100), 0)
    : 0;

  function handleAdd() {
    const amount = parseFloat(form.amount);
    if (!form.label.trim()) {
      setError('Veuillez saisir un libellé.');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Veuillez saisir un montant valide.');
      return;
    }
    onAdd({
      id: crypto.randomUUID(),
      label: form.label.trim(),
      amount,
      category: form.category,
      tvaRate: form.tvaRate,
    });
    setForm(INITIAL_FORM);
    setError('');
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setIsOpen(false);
      setForm(INITIAL_FORM);
      setError('');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Receipt className="size-4 text-muted-foreground" />
            Achats & dépenses professionnels
          </span>
          {expenses.length > 0 && (
            <Badge variant="secondary" className="text-xs font-normal">
              {expenses.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs">
            {isSubjectToTva
              ? 'Vous êtes assujetti à la TVA. La TVA sur vos achats professionnels est déductible de la TVA collectée.'
              : 'En franchise de TVA, vous ne récupérez pas la TVA sur vos achats. Les montants saisis sont des charges HT pour votre information.'}
          </AlertDescription>
        </Alert>

        {/* Liste des dépenses */}
        {expenses.length > 0 && (
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium truncate">{expense.label}</span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {EXPENSE_CATEGORY_LABELS[expense.category]}
                    </Badge>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{formatCurrency(expense.amount)} HT</span>
                    {isSubjectToTva && expense.tvaRate > 0 && (
                      <span>TVA {expense.tvaRate}% = {formatCurrency(expense.amount * (expense.tvaRate / 100))}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(expense.id)}
                  className="ml-2 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Supprimer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}

            {/* Totaux */}
            <div className="rounded-lg bg-muted/50 px-3 py-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total achats HT</span>
                <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
              </div>
              {isSubjectToTva && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">TVA déductible</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    − {formatCurrency(totalTvaDeductible)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {isOpen ? (
          <div className="space-y-3 rounded-lg border p-3" onKeyDown={handleKeyDown}>
            <div className="space-y-1.5">
              <Label htmlFor="expense-label" className="text-xs">Libellé</Label>
              <Input
                id="expense-label"
                placeholder="Ex. Ordinateur portable"
                value={form.label}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="expense-amount" className="text-xs">Montant HT (€)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="1 200"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expense-tva" className="text-xs">Taux TVA</Label>
                <Select
                  value={String(form.tvaRate)}
                  onValueChange={(v) =>
                    v && setForm((p) => ({ ...p, tvaRate: parseFloat(v) as TvaRate }))
                  }
                >
                  <SelectTrigger id="expense-tva" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(TVA_RATE_LABELS) as [string, string][]).map(([rate, label]) => (
                      <SelectItem key={rate} value={rate}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expense-category" className="text-xs">Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  v && setForm((p) => ({ ...p, category: v as ExpenseCategory }))
                }
              >
                <SelectTrigger id="expense-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(EXPENSE_CATEGORY_LABELS) as [ExpenseCategory, string][]).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} className="flex-1">
                Ajouter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setForm(INITIAL_FORM);
                  setError('');
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="size-4" />
            Ajouter une dépense
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
