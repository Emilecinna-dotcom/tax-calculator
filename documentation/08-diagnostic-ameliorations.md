# Diagnostic, corrections et améliorations

État de santé du projet, et pistes d'évolution. Priorités : 🔴 critique, 🟠 important, 🟢 confort.

## État actuel

- App fonctionnelle, déployée sur Vercel, taux **2026** intégrés.
- Architecture propre (données / calcul / état / affichage bien séparés), calcul en temps réel.

## Points de vigilance

- 🟠 **Estimations vs exactitude** : les cotisations et le statut TVA sont exacts ; l'**IR au barème progressif** et la **CFE** sont des estimations (l'IR réel dépend de tous les revenus du foyer ; la CFE dépend de la commune). À garder signalé clairement dans l'UI pour ne pas induire l'utilisateur en erreur.
- 🟠 **Décomposition des cotisations approximative** : le détail (maladie, retraite, CSG…) est réparti au prorata, pas issu des taux réels de chaque poste. Informatif uniquement.
- 🟢 **Maintenance annuelle** : à chaque nouvelle année fiscale, mettre à jour `src/lib/constants.ts` (taux, seuils, plafonds) et vérifier les libellés. C'est le seul point d'entrée à toucher.

## Améliorations possibles

- 🟢 Comparateur **versement libératoire vs barème** (afficher les deux côte à côte pour aider au choix).
- 🟢 **Export** (PDF / impression) du récapitulatif.
- 🟢 Prise en compte plus fine des **charges réelles** dans un scénario « au réel » (hors micro).
- 🟢 Historique / sauvegarde des simulations (localStorage).
- 🟢 Tests unitaires sur `taxCalculations.ts` (fonctions pures, faciles à couvrir) pour sécuriser la mise à jour annuelle des taux.
