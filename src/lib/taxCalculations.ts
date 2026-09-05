import type {
  TaxInputs,
  TaxResult,
  CotisationsSociales,
  ImpotRevenu,
  TVAInfo,
  CFEInfo,
  ActivityType,
} from '../types';
import {
  COTISATIONS_RATES,
  COTISATIONS_RATES_ACRE,
  VERSEMENT_LIBERATOIRE_RATES,
  TVA_THRESHOLDS,
  CFE_EXEMPT_CA,
  CFE_MIN_ESTIMATE,
  CFE_MAX_ESTIMATE,
  ACTIVITY_LABELS,
} from './constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─── Cotisations sociales ─────────────────────────────────────────────────────

function computeCotisationsSociales(
  revenue: number,
  activityType: ActivityType,
  hasAcre: boolean,
): CotisationsSociales {
  const baseRate = hasAcre
    ? COTISATIONS_RATES_ACRE[activityType]
    : COTISATIONS_RATES[activityType];

  const amount = round2(revenue * baseRate);

  // Décomposition approximative pour information (proportionnelle)
  const breakdown = computeBreakdown(activityType, amount, revenue);

  return {
    rate: baseRate,
    amount,
    label: ACTIVITY_LABELS[activityType],
    breakdown,
  };
}

function computeBreakdown(
  activityType: ActivityType,
  totalAmount: number,
  _revenue: number,
): CotisationsSociales['breakdown'] {
  if (activityType === 'bic_vente' || activityType === 'location_meublee') {
    return {
      malady: round2(totalAmount * 0.10),
      retraiteBase: round2(totalAmount * 0.30),
      retraiteComplementaire: round2(totalAmount * 0.15),
      invaliditeDeces: round2(totalAmount * 0.05),
      allocationsFamiliales: round2(totalAmount * 0.15),
      formationProfessionnelle: round2(totalAmount * 0.10),
      csgCrds: round2(totalAmount * 0.15),
    };
  }

  return {
    malady: round2(totalAmount * 0.12),
    retraiteBase: round2(totalAmount * 0.28),
    retraiteComplementaire: round2(totalAmount * 0.17),
    invaliditeDeces: round2(totalAmount * 0.05),
    allocationsFamiliales: round2(totalAmount * 0.14),
    formationProfessionnelle: round2(totalAmount * 0.10),
    csgCrds: round2(totalAmount * 0.14),
  };
}

// ─── Impôt sur le revenu ──────────────────────────────────────────────────────

function computeImpotRevenu(
  revenue: number,
  activityType: ActivityType,
  hasVersementLiberatoire: boolean,
  numberOfParts: number,
): ImpotRevenu {
  if (hasVersementLiberatoire) {
    const rate = VERSEMENT_LIBERATOIRE_RATES[activityType];
    return {
      rate,
      amount: round2(revenue * rate),
      isVersementLiberatoire: true,
      label: 'Versement libératoire de l\'IR (payé avec les cotisations)',
    };
  }

  const abattementRate = getAbattementRate(activityType);
  const taxableIncome = round2(revenue * (1 - abattementRate));

  const parts = Math.max(1, numberOfParts);
  const estimatedTax = round2(computeBaremeProgressif(taxableIncome / parts) * parts);

  return {
    rate: revenue > 0 ? round2(estimatedTax / revenue) : 0,
    amount: estimatedTax,
    isVersementLiberatoire: false,
    label: `Impôt sur le revenu (barème progressif, après abattement ${Math.round(abattementRate * 100)}%)`,
  };
}

function getAbattementRate(activityType: ActivityType): number {
  switch (activityType) {
    case 'bic_vente':
    case 'location_meublee':
      return 0.71; // 71% abattement
    case 'bic_service':
      return 0.50; // 50% abattement
    case 'bnc_liberale':
    case 'bnc_cipav':
      return 0.34; // 34% abattement
    default:
      return 0.34;
  }
}

function computeBaremeProgressif(revenuNet: number): number {
  // Barème 2024 (déclaration 2025) — tranche pour 1 part
  // Seuils: 0, 11 497, 29 315, 83 823, 180 294
  // Taux:   0%,  11%,   30%,   41%,    45%
  const tranches = [
    { limite: 11_497, taux: 0 },
    { limite: 29_315, taux: 0.11 },
    { limite: 83_823, taux: 0.30 },
    { limite: 180_294, taux: 0.41 },
    { limite: Infinity, taux: 0.45 },
  ];

  let impot = 0;
  let precedent = 0;

  for (const tranche of tranches) {
    if (revenuNet <= precedent) break;
    const imposable = Math.min(revenuNet, tranche.limite) - precedent;
    impot += imposable * tranche.taux;
    precedent = tranche.limite;
  }

  return round2(impot);
}

// ─── TVA ──────────────────────────────────────────────────────────────────────

function computeTVAInfo(
  revenue: number,
  activityType: ActivityType,
  tvaDeductible: number,
): TVAInfo {
  const { base, tolerance } = TVA_THRESHOLDS[activityType];
  const exceeds = revenue > base;

  // Si sous le seuil de franchise : pas de TVA collectée
  if (!exceeds) {
    return {
      isSubjectToTva: false,
      threshold: base,
      toleranceThreshold: tolerance,
      exceeds: false,
      tvaCollectee: 0,
      tvaDeductible: 0,
      tvaNet: 0,
    };
  }

  // Au-dessus du seuil : TVA au taux normal (20% par défaut)
  // La TVA est collectée sur le CA HT
  const tvaCollectee = round2(revenue * 0.20);

  return {
    isSubjectToTva: true,
    threshold: base,
    toleranceThreshold: tolerance,
    exceeds: true,
    tvaCollectee,
    tvaDeductible: round2(tvaDeductible),
    tvaNet: round2(tvaCollectee - tvaDeductible),
  };
}

// ─── CFE ─────────────────────────────────────────────────────────────────────

function computeCFEInfo(revenue: number, isFirstYear: boolean): CFEInfo {
  if (isFirstYear) {
    return {
      exempt: true,
      estimatedMin: 0,
      estimatedMax: 0,
      isFirstYear: true,
    };
  }

  if (revenue <= CFE_EXEMPT_CA) {
    return {
      exempt: true,
      estimatedMin: 0,
      estimatedMax: 0,
      isFirstYear: false,
    };
  }

  // Estimation selon le CA (taux variable selon commune)
  // La CFE est basée sur la valeur locative des locaux, mais pour un micro-entrepreneur
  // sans locaux professionnels, la base minimale est appliquée
  const estimatedMin = CFE_MIN_ESTIMATE;
  const estimatedMax = Math.min(CFE_MAX_ESTIMATE, round2(revenue * 0.02));

  return {
    exempt: false,
    estimatedMin,
    estimatedMax: Math.max(estimatedMin, estimatedMax),
    isFirstYear: false,
  };
}

// ─── Calcul TVA déductible sur les achats ────────────────────────────────────

export function computeTvaDeductible(
  expenses: TaxInputs['expenses'],
  isSubjectToTva: boolean,
): number {
  if (!isSubjectToTva) return 0;

  return expenses.reduce((total, expense) => {
    const tvaAmount = expense.amount * (expense.tvaRate / 100);
    return total + tvaAmount;
  }, 0);
}

// ─── Calcul principal ─────────────────────────────────────────────────────────

export function computeTaxes(inputs: TaxInputs): TaxResult {
  const {
    revenue,
    activityType,
    hasAcre,
    hasVersementLiberatoire,
    numberOfParts,
    expenses,
    isFirstYear,
  } = inputs;

  // 1. Cotisations sociales
  const cotisationsSociales = computeCotisationsSociales(
    revenue,
    activityType,
    hasAcre,
  );

  // 2. TVA déductible sur les achats (seulement si assujetti à la TVA)
  const tvaThresholds = TVA_THRESHOLDS[activityType];
  const isSubjectToTva = revenue > tvaThresholds.base;
  const tvaDeductibleAmount = computeTvaDeductible(expenses, isSubjectToTva);

  // 3. TVA
  const tvaInfo = computeTVAInfo(revenue, activityType, tvaDeductibleAmount);

  // 4. Impôt sur le revenu
  const impotRevenu = computeImpotRevenu(
    revenue,
    activityType,
    hasVersementLiberatoire,
    numberOfParts,
  );

  // 5. CFE
  const cfeInfo = computeCFEInfo(revenue, isFirstYear);

  // 6. Total des taxes obligatoires (hors CFE qui est variable)
  const totalTaxes = round2(
    cotisationsSociales.amount +
    impotRevenu.amount +
    (tvaInfo.isSubjectToTva ? Math.max(0, tvaInfo.tvaNet) : 0),
  );

  const totalTaxRate = revenue > 0 ? round2(totalTaxes / revenue) : 0;

  // 7. Revenu net (CA - total dépenses professionnelles HT)
  const totalExpensesHT = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netRevenue = round2(revenue - totalExpensesHT);

  // 8. Net après taxes
  const netAfterTaxes = round2(revenue - totalTaxes);
  const monthlyNet = round2(netAfterTaxes / 12);

  return {
    revenue,
    netRevenue,
    cotisationsSociales,
    impotRevenu,
    tvaInfo,
    cfeInfo,
    totalTaxes,
    totalTaxRate,
    netAfterTaxes,
    monthlyNet,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
}
