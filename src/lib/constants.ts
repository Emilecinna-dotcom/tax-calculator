import type { ActivityType, ExpenseCategory, TvaRate } from '../types';

// ─── Taux cotisations sociales 2026 ───────────────────────────────────────────
export const COTISATIONS_RATES: Record<ActivityType, number> = {
  bic_vente: 0.123,        // Achat-vente de marchandises
  bic_service: 0.212,      // Prestations de services commerciales/artisanales
  bnc_liberale: 0.256,     // Professions libérales non-réglementées (taux 2026, 25.6%)
  bnc_cipav: 0.232,        // Professions libérales réglementées CIPAV
  location_meublee: 0.06,  // Location meublée de tourisme classée
};

// Taux avec ACRE (50% de réduction la 1ère année → 25% à partir du 1er juillet 2026)
// Pour les créations avant le 1er janvier 2026, on garde les anciens taux ACRE
export const COTISATIONS_RATES_ACRE: Record<ActivityType, number> = {
  bic_vente: 0.123 * 0.5,
  bic_service: 0.212 * 0.5,
  bnc_liberale: 0.256 * 0.5,
  bnc_cipav: 0.232 * 0.5,
  location_meublee: 0.06 * 0.5,
};

// ─── Taux versement libératoire de l'IR 2026 ─────────────────────────────────
export const VERSEMENT_LIBERATOIRE_RATES: Record<ActivityType, number> = {
  bic_vente: 0.01,        // 1%
  bic_service: 0.017,     // 1.7%
  bnc_liberale: 0.022,    // 2.2%
  bnc_cipav: 0.022,       // 2.2%
  location_meublee: 0.01, // 1%
};

// ─── Seuils TVA franchise en base 2025-2026 ───────────────────────────────────
export const TVA_THRESHOLDS: Record<ActivityType, { base: number; tolerance: number }> = {
  bic_vente: { base: 85_000, tolerance: 93_500 },
  bic_service: { base: 37_500, tolerance: 41_250 },
  bnc_liberale: { base: 37_500, tolerance: 41_250 },
  bnc_cipav: { base: 37_500, tolerance: 41_250 },
  location_meublee: { base: 85_000, tolerance: 93_500 },
};

// ─── Plafonds chiffre d'affaires auto-entrepreneur ───────────────────────────
export const CA_PLAFONDS: Record<ActivityType, number> = {
  bic_vente: 203_100,
  bic_service: 83_600,
  bnc_liberale: 83_600,
  bnc_cipav: 83_600,
  location_meublee: 203_100,
};

// ─── CFE (estimations) ────────────────────────────────────────────────────────
export const CFE_EXEMPT_CA = 5_000;       // Exonéré si CA ≤ 5 000 €
export const CFE_MIN_ESTIMATE = 200;      // Estimation minimale
export const CFE_MAX_ESTIMATE = 2_000;   // Estimation maximale

// ─── Libellés d'activité ──────────────────────────────────────────────────────
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  bic_vente: 'Achat-revente de marchandises (BIC)',
  bic_service: 'Prestations de services commerciales/artisanales (BIC)',
  bnc_liberale: 'Profession libérale non-réglementée (BNC)',
  bnc_cipav: 'Profession libérale réglementée CIPAV (BNC)',
  location_meublee: 'Location meublée de tourisme classée',
};

export const ACTIVITY_DESCRIPTIONS: Record<ActivityType, string> = {
  bic_vente: 'Commerce, e-commerce, revente de biens physiques ou numériques',
  bic_service: 'Artisan, prestataire de services commerciaux (consultant, formateur...)',
  bnc_liberale: 'Développeur, designer, rédacteur, coach, consultant...',
  bnc_cipav: 'Architecte, expert-comptable, avocat, médecin... (affiliation CIPAV)',
  location_meublee: 'Airbnb, gîte classé, chambre d\'hôtes classée',
};

// ─── Catégories de dépenses ───────────────────────────────────────────────────
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  materiel: 'Matériel & équipement',
  logiciel: 'Logiciels & abonnements',
  formation: 'Formation professionnelle',
  deplacement: 'Déplacements & transport',
  telecommunication: 'Téléphonie & internet',
  bureau: 'Fournitures de bureau',
  publicite: 'Publicité & marketing',
  autre: 'Autre',
};

// ─── Taux TVA disponibles ─────────────────────────────────────────────────────
export const TVA_RATE_LABELS: Record<TvaRate, string> = {
  0: 'Exonéré (0%)',
  5.5: 'Taux réduit (5,5%)',
  10: 'Taux intermédiaire (10%)',
  20: 'Taux normal (20%)',
};
