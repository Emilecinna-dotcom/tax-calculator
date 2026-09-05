import { useState, useMemo } from 'react';
import type { TaxInputs, Expense } from '@/types';
import { computeTaxes } from '@/lib/taxCalculations';
import { CA_PLAFONDS } from '@/lib/constants';

const DEFAULT_INPUTS: TaxInputs = {
  revenue: 0,
  activityType: 'bnc_liberale',
  declarationPeriod: 'monthly',
  hasAcre: false,
  acreYear: 1,
  hasVersementLiberatoire: false,
  numberOfParts: 1,
  expenses: [],
  isFirstYear: false,
};

export function useTaxCalculator() {
  const [inputs, setInputs] = useState<TaxInputs>(DEFAULT_INPUTS);

  const result = useMemo(() => {
    if (inputs.revenue <= 0) return null;
    return computeTaxes(inputs);
  }, [inputs]);

  const caPlafond = CA_PLAFONDS[inputs.activityType];
  const caExceedsPlafond = inputs.revenue > caPlafond;

  function updateInputs(partial: Partial<TaxInputs>) {
    setInputs((prev) => ({ ...prev, ...partial }));
  }

  function addExpense(expense: Expense) {
    setInputs((prev) => ({ ...prev, expenses: [...prev.expenses, expense] }));
  }

  function removeExpense(id: string) {
    setInputs((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  }

  return {
    inputs,
    result,
    caPlafond,
    caExceedsPlafond,
    updateInputs,
    addExpense,
    removeExpense,
  };
}
