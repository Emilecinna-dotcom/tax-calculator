# Diagnostic, corrections et améliorations

État de santé du projet, et pistes d'évolution. Priorités : 🔴 critique, 🟠 important, 🟢 confort.

## État actuel

- App fonctionnelle, déployée sur Vercel, taux **2026** intégrés.
- Deux régimes : **Auto-entrepreneur** (chiffre d'affaires) et **Salarié**
  (cadre secteur privé / fonctionnaire titulaire), sélecteur en haut de page.
- Architecture propre (données / calcul / état / affichage bien séparés), calcul en temps réel.
- **9 tests unitaires** (`npm run test`) sur `taxCalculations.ts` : barème
  progressif, auto-entrepreneur, salarié cadre/fonctionnaire, tranches T1/T2,
  parts fiscales. Protège contre une régression silencieuse à la mise à jour
  annuelle des taux.
- **Historique local** (localStorage, 10 dernières simulations par régime) :
  bouton Enregistrer sur chaque synthèse, bouton Historique pour rappeler ou
  supprimer une simulation passée. Rien n'est envoyé hors du navigateur.
- **Impression / export PDF** : bouton sur chaque synthèse, imprime uniquement
  le résultat (formulaire et navigation masqués), fond forcé en blanc quel
  que soit le thème à l'écran.
- **Comparateur versement libératoire vs barème progressif** (ImpotCard) :
  affiche les deux montants côte à côte, indique lequel est le plus
  avantageux pour le CA saisi, indépendamment de l'option cochée.
- **RAFP affiné** : champ optionnel « part de primes » pour les fonctionnaires,
  au lieu du seul forfait 20% du brut.

## Points de vigilance

- 🟠 **Estimations vs exactitude** : les cotisations et le statut TVA sont exacts ; l'**IR au barème progressif** et la **CFE** sont des estimations (l'IR réel dépend de tous les revenus du foyer ; la CFE dépend de la commune). À garder signalé clairement dans l'UI pour ne pas induire l'utilisateur en erreur.
- 🟠 **Décomposition des cotisations approximative** : le détail (maladie, retraite, CSG…) est réparti au prorata, pas issu des taux réels de chaque poste. Informatif uniquement.
- 🟠 **Régime Salarié — pas de prélèvement à la source personnalisé** : le simulateur calcule l'IR annuel total, pas le taux de PAS mensuel réel (qui dépend de l'historique fiscal du foyer). Le « net après impôt » est donc indicatif, pas le montant exact qui tombe chaque mois sur le compte.
- 🟢 **Maintenance annuelle** : à chaque nouvelle année fiscale, mettre à jour `src/lib/constants.ts` (taux, seuils, plafonds), vérifier les libellés, et lancer `npm run test` pour confirmer que les tests reflètent encore les nouveaux montants (ils échoueront intentionnellement tant qu'ils ne sont pas mis à jour).

## Améliorations possibles

- 🟢 Prise en compte plus fine des **charges réelles** dans un scénario « au réel » (hors micro).
- 🟢 Étendre les tests unitaires à la TVA et à la CFE (actuellement seuls les cotisations, l'IR et le régime Salarié sont couverts).
- 🟢 `npm audit` signale des vulnérabilités dans les dépendances de développement (vitest et sa chaîne) — à revoir avant d'ajouter d'autres dépendances de test, sans urgence pour un outil de calcul côté client sans backend.
