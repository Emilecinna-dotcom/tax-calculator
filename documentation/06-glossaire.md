# Glossaire

**Règle d'entretien** : chaque nouveau terme technique ou fiscal introduit dans le projet est ajouté ici au moment où il apparaît (apprendre en développant).

## Technique

- **Vite** : outil de build et serveur de développement rapide pour les apps web modernes.
- **React** : bibliothèque d'interface à base de composants réutilisables.
- **TypeScript** : JavaScript avec des types stricts (attrape les erreurs avant l'exécution). Les types du projet sont dans `src/types/index.ts`.
- **Tailwind CSS** : styles par classes utilitaires directement dans le HTML/JSX.
- **shadcn/ui** : ensemble de composants d'interface prêts à l'emploi (boutons, cartes, champs), copiés dans le projet et personnalisables. Basé ici sur `@base-ui/react`.
- **Hook (React)** : fonction qui encapsule une logique d'état réutilisable. Ici `useTaxCalculator` gère toutes les saisies et le résultat.
- **useMemo** : hook React qui recalcule une valeur seulement quand ses dépendances changent — c'est ce qui rend le calcul « en temps réel » sans recalcul inutile.
- **Fonction pure** : fonction qui, pour les mêmes entrées, renvoie toujours la même sortie sans effet de bord. Toute la couche `taxCalculations.ts` est pure.
- **framer-motion** : bibliothèque d'animations pour React.

## Fiscal (le domaine)

- **Auto-entrepreneur / micro-entreprise** : régime simplifié pour un entrepreneur individuel.
- **Chiffre d'affaires (CA)** : total encaissé, base de tous les calculs.
- **Cotisations sociales (URSSAF)** : versements pour la protection sociale, calculés en % du CA.
- **ACRE** : aide à la création d'entreprise = exonération partielle des cotisations les premières années (taux réduits).
- **BIC** : Bénéfices Industriels et Commerciaux (vente de biens ou services commerciaux).
- **BNC** : Bénéfices Non Commerciaux (professions libérales).
- **CIPAV** : caisse de retraite de certaines professions libérales (taux de cotisation spécifique).
- **Versement libératoire (VL)** : option pour payer l'impôt sur le revenu en petit % du CA, au fil de l'eau.
- **Abattement forfaitaire** : pourcentage du CA retiré avant calcul de l'impôt au barème (71 %, 50 % ou 34 % selon l'activité) — représente les charges « présumées ».
- **Barème progressif** : le calcul de l'impôt par tranches, appliqué au revenu imposable.
- **Quotient familial / nombre de parts** : mécanisme qui divise le revenu imposable par le nombre de parts du foyer avant d'appliquer le barème, puis multiplie — allège l'impôt selon la composition familiale.
- **Franchise en base de TVA** : sous un seuil de CA, on ne facture pas la TVA.
- **CFE** : Cotisation Foncière des Entreprises, un impôt local (dépend de la commune).
- **Plafond micro** : CA maximum pour rester au régime micro-entreprise.
