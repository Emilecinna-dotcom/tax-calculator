export type ActivityType =
  | 'bic_vente'
  | 'bic_service'
  | 'bnc_liberale'
  | 'bnc_cipav'
  | 'location_meublee';

export type DeclarationPeriod = 'monthly' | 'quarterly';

export interface Expense {
  id: string;
  label: string;
  amount: number;
  category: ExpenseCategory;
  tvaRate: TvaRate;
}

export type ExpenseCategory =
  | 'materiel'
  | 'logiciel'
  | 'formation'
  | 'deplacement'
  | 'telecommunication'
  | 'bureau'
  | 'publicite'
  | 'autre';

export type TvaRate = 0 | 5.5 | 10 | 20;

export interface TaxInputs {
  revenue: number;
  activityType: ActivityType;
  declarationPeriod: DeclarationPeriod;
  hasAcre: boolean;
  acreYear: 1 | 2 | 3;
  hasVersementLiberatoire: boolean;
  numberOfParts: number;
  expenses: Expense[];
  isFirstYear: boolean;
}

export interface CotisationsSociales {
  rate: number;
  amount: number;
  label: string;
  breakdown: {
    malady: number;
    retraiteBase: number;
    retraiteComplementaire: number;
    invaliditeDeces: number;
    allocationsFamiliales: number;
    formationProfessionnelle: number;
    csgCrds: number;
  };
}

export interface ImpotRevenu {
  rate: number;
  amount: number;
  isVersementLiberatoire: boolean;
  label: string;
}

export interface TVAInfo {
  isSubjectToTva: boolean;
  threshold: number;
  toleranceThreshold: number;
  exceeds: boolean;
  tvaCollectee: number;
  tvaDeductible: number;
  tvaNet: number;
}

export interface CFEInfo {
  exempt: boolean;
  estimatedMin: number;
  estimatedMax: number;
  isFirstYear: boolean;
}

export interface TaxResult {
  revenue: number;
  netRevenue: number;
  cotisationsSociales: CotisationsSociales;
  impotRevenu: ImpotRevenu;
  tvaInfo: TVAInfo;
  cfeInfo: CFEInfo;
  totalTaxes: number;
  totalTaxRate: number;
  netAfterTaxes: number;
  monthlyNet: number;
}

// ── Salarié (cadre secteur privé / fonctionnaire) ──
// Régime totalement différent de l'auto-entrepreneur : cotisations prélevées
// à la source sur un salaire brut, pas de chiffre d'affaires ni de TVA.

export type SalarieStatut = 'cadre_prive' | 'fonctionnaire' | 'contractuel_public';

export interface SalarieInputs {
  grossAnnual: number;
  statut: SalarieStatut;
  numberOfParts: number;
  /** Fonctionnaire uniquement : part du brut correspondant aux primes,
   * base réelle du RAFP. Optionnel — 20% par défaut si non renseigné. */
  primesPercent?: number;
}

export interface SalarieCotisationLine {
  label: string;
  amount: number;
}

export interface SalarieResult {
  grossAnnual: number;
  cotisationLines: SalarieCotisationLine[];
  totalCotisations: number;
  /** Revenu net imposable : sert de base au calcul de l'impôt, différent du
   * net perçu car la CSG non déductible et la CRDS n'y sont pas retirées. */
  netImposable: number;
  /** Net avant impôt : ce que le salarié touche réellement, avant
   * prélèvement à la source. */
  netBeforeTax: number;
  impotRevenu: ImpotRevenu;
  netAfterTax: number;
  monthlyNetBeforeTax: number;
  monthlyNetAfterTax: number;
}
