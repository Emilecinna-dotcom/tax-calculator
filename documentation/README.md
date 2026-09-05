# Documentation — Simulateur Fiscal Auto-Entrepreneur

Calculateur fiscal pour les **auto-entrepreneurs français** (cotisations, impôt, TVA, CFE) en temps réel, taux **2026**.

**Chemin :** `~/Projets web/tax-calculator`
**En ligne :** https://tax-calculator-dusky-ten.vercel.app
**Stack :** Vite · React 19 · TypeScript · shadcn/ui · Tailwind CSS 4 · Vercel

## Sommaire

1. [Vue d'ensemble](01-vue-ensemble.md) — ce que c'est, pour qui, stack, principe.
2. [Architecture](02-architecture.md) — la séparation données / calcul / état / affichage.
3. [Calculs fiscaux](03-calculs-fiscaux.md) — le cœur métier : cotisations, IR, TVA, CFE, taux 2026.
4. [Interface](04-interface.md) — les composants (saisie + cartes de résultats).
5. [Journal des sessions](05-journal-des-sessions.md) — historique daté du projet.
6. [Glossaire](06-glossaire.md) — termes techniques et fiscaux.
7. [Workflows](07-workflows.md) — diagrammes Mermaid des flux.
8. [Diagnostic & améliorations](08-diagnostic-ameliorations.md) — état, vigilance, pistes.
9. [Lancer & déployer](09-lancer-deployer.md) — dev, build, déploiement, maintenance annuelle.

## Pour reprendre le projet

Lire d'abord [01-vue-ensemble.md](01-vue-ensemble.md), puis [03-calculs-fiscaux.md](03-calculs-fiscaux.md) (le domaine) et `src/hooks/useTaxCalculator.ts` (l'état). Pour la mise à jour annuelle des taux : uniquement `src/lib/constants.ts`.
