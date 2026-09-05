# Vue d'ensemble

## Ce que c'est

**Simulateur Fiscal Auto-Entrepreneur** : une application web qui calcule, en temps réel, ce qu'un auto-entrepreneur français doit payer, avec les taux **2026** à jour.

À partir du **type d'activité** et du **chiffre d'affaires** saisis, l'app estime instantanément :
- les **cotisations sociales** URSSAF (selon l'activité, avec option **ACRE** les premières années) ;
- l'**impôt sur le revenu** : soit le **versement libératoire**, soit le **barème progressif** après abattement (avec le quotient familial, le nombre de parts) ;
- le **statut TVA** (franchise en base ou assujetti, selon les seuils) ;
- la **CFE** (cotisation foncière des entreprises) estimée ;
- un contrôle du **plafond de chiffre d'affaires** du régime micro.

## Pour qui

Un auto-entrepreneur (ou futur) qui veut savoir concrètement, avant de se lancer ou en cours d'année, combien il lui restera net et ce qu'il doit provisionner.

## Stack technique

- **Vite** (bundler/dev server) + **React 19** + **TypeScript**.
- **shadcn/ui** (composants basés sur `@base-ui/react`) + **Tailwind CSS 4** pour l'interface.
- **framer-motion** pour les animations, **lucide-react** pour les icônes.
- Hébergement : **Vercel** → https://tax-calculator-dusky-ten.vercel.app

## Principe de conception

Séparation nette en quatre couches, pour pouvoir mettre à jour les taux d'une année sur l'autre sans toucher au reste :

1. **Données** (`src/lib/constants.ts`) — les taux, seuils et plafonds.
2. **Calcul** (`src/lib/taxCalculations.ts`) — la logique fiscale pure.
3. **État** (`src/hooks/useTaxCalculator.ts`) — les saisies et le résultat réactif.
4. **Affichage** (`src/components/`) — l'interface, qui ne fait qu'afficher.

Voir [02-architecture.md](02-architecture.md) pour le détail.
