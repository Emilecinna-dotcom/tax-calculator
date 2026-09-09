import { describe, it, expect } from 'vitest';
import { computeTaxes, computeSalaireResult, computeBaremeProgressif } from './taxCalculations';

// Ces valeurs de référence ont été vérifiées à la main (calcul manuel des
// tranches, cotisations, CSG/CRDS) avant d'être figées ici. Si un taux change
// dans constants.ts sans mise à jour de ces tests, ils échoueront : c'est le
// but — attraper une régression silencieuse sur une valeur réellement payée
// par quelqu'un, avant la mise en ligne plutôt qu'après.

describe('computeBaremeProgressif', () => {
  it('ne taxe rien sous la première tranche', () => {
    expect(computeBaremeProgressif(10_000)).toBe(0);
  });

  it('applique les tranches progressivement, pas le taux marginal à tout', () => {
    // 20 000€ : (20000-11497)*0.11 = 935.33
    expect(computeBaremeProgressif(20_000)).toBeCloseTo(935.33, 1);
  });
});

describe('computeTaxes — auto-entrepreneur', () => {
  it('calcule un profil BNC libérale à 45 000€ (cas testé manuellement)', () => {
    const result = computeTaxes({
      revenue: 45_000,
      activityType: 'bnc_liberale',
      declarationPeriod: 'monthly',
      hasAcre: false,
      acreYear: 1,
      hasVersementLiberatoire: false,
      numberOfParts: 1,
      expenses: [],
      isFirstYear: false,
    });

    expect(result.cotisationsSociales.amount).toBeCloseTo(11_520, 0);
    expect(result.impotRevenu.amount).toBeCloseTo(2_075, 0);
    expect(result.netAfterTaxes).toBeCloseTo(22_405, -1);
  });

  it('le taux affiché n\'est pas tronqué par un arrondi en cascade (régression)', () => {
    const result = computeTaxes({
      revenue: 45_000,
      activityType: 'bnc_liberale',
      declarationPeriod: 'monthly',
      hasAcre: false,
      acreYear: 1,
      hasVersementLiberatoire: false,
      numberOfParts: 1,
      expenses: [],
      isFirstYear: false,
    });

    // Avant la correction, round2 sur un ratio tronquait ex. 0.0826 -> 0.08.
    // Le taux exact doit garder plus de précision que 2 décimales du ratio.
    expect(result.impotRevenu.rate).toBeCloseTo(result.impotRevenu.amount / 45_000, 6);
  });

  it('un CA nul ne casse rien', () => {
    const result = computeTaxes({
      revenue: 0,
      activityType: 'bic_vente',
      declarationPeriod: 'monthly',
      hasAcre: false,
      acreYear: 1,
      hasVersementLiberatoire: false,
      numberOfParts: 1,
      expenses: [],
      isFirstYear: false,
    });
    expect(result.totalTaxes).toBe(0);
    expect(result.netAfterTaxes).toBe(0);
  });
});

describe('computeSalaireResult — fonctionnaire', () => {
  it('50 000€ brut, 1 part (cas vérifié à la main)', () => {
    const result = computeSalaireResult({
      grossAnnual: 50_000,
      statut: 'fonctionnaire',
      numberOfParts: 1,
    });

    expect(result.totalCotisations).toBeCloseTo(10_815, 0);
    expect(result.netBeforeTax).toBeCloseTo(39_185, 0);
    expect(result.impotRevenu.amount).toBeCloseTo(4_130, 0);
    expect(result.netAfterTax).toBeCloseTo(35_055, 0);
    // Taux affiché : 4130/50000 = 8.26%, ne doit pas être tronqué à 8.0%
    expect(result.impotRevenu.rate).toBeCloseTo(0.0826, 3);
  });
});

describe('computeSalaireResult — cadre du secteur privé', () => {
  it('50 000€ brut, sous et au-dessus du PASS (tranches T1/T2)', () => {
    const result = computeSalaireResult({
      grossAnnual: 50_000,
      statut: 'cadre_prive',
      numberOfParts: 1,
    });

    // T1 = 48 060 (PASS 2026), T2 = 1 940
    expect(result.totalCotisations).toBeCloseTo(10_467, 0);
    expect(result.netBeforeTax).toBeCloseTo(39_533, 0);
    expect(result.netAfterTax).toBeCloseTo(35_309, 0);
  });

  it('sous le PASS, aucune cotisation T2 ni CET ne doit se déclencher', () => {
    const result = computeSalaireResult({
      grossAnnual: 30_000,
      statut: 'cadre_prive',
      numberOfParts: 1,
    });

    const cet = result.cotisationLines.find((l) => l.label === 'CET');
    expect(cet?.amount).toBe(0);
  });
});

describe('computeSalaireResult — contractuel de la fonction publique', () => {
  it('50 000€ brut : IRCANTEC et non pension civile', () => {
    const result = computeSalaireResult({
      grossAnnual: 50_000,
      statut: 'contractuel_public',
      numberOfParts: 1,
    });

    expect(result.cotisationLines.find((l) => l.label.includes('IRCANTEC'))).toBeTruthy();
    expect(result.cotisationLines.find((l) => l.label.includes('pension civile'))).toBeUndefined();
    // T1 = 48 060, T2 = 1 940 : 48060*0.0284 + 1940*0.0706 = 1364.9 + 136.96 = 1501.86
    const ircantec = result.cotisationLines
      .filter((l) => l.label.includes('IRCANTEC'))
      .reduce((sum, l) => sum + l.amount, 0);
    expect(ircantec).toBeCloseTo(1_501.86, 0);
  });
});

describe('computeSalaireResult — parts fiscales', () => {
  it('plus de parts réduit l\'impôt, jamais les cotisations', () => {
    const seul = computeSalaireResult({ grossAnnual: 50_000, statut: 'cadre_prive', numberOfParts: 1 });
    const famille = computeSalaireResult({ grossAnnual: 50_000, statut: 'cadre_prive', numberOfParts: 3 });

    expect(famille.impotRevenu.amount).toBeLessThan(seul.impotRevenu.amount);
    expect(famille.totalCotisations).toBe(seul.totalCotisations);
  });
});
