# Workflows (Mermaid)

Diagrammes des principaux flux. Voir [02-architecture.md](02-architecture.md) et [03-calculs-fiscaux.md](03-calculs-fiscaux.md) pour le détail.

## 1. Boucle de calcul en temps réel

```mermaid
flowchart TD
    A[Utilisateur modifie une saisie] --> B[updateInputs / addExpense / removeExpense]
    B --> C[Nouvel objet inputs dans le state]
    C --> D{revenue > 0 ?}
    D -->|non| E[result = null → écran d'invite]
    D -->|oui| F["useMemo: computeTaxes(inputs)"]
    F --> G[Constantes 2026 lues dans constants.ts]
    G --> H[TaxResult: cotisations + IR + TVA + CFE]
    H --> I[Cartes de résultats re-rendues]
    C --> J{revenue > CA_PLAFONDS ?}
    J -->|oui| K[Alerte dépassement du plafond micro]
```

## 2. Choix de la méthode d'impôt sur le revenu

```mermaid
flowchart TD
    A[computeImpotRevenu] --> B{hasVersementLiberatoire ?}
    B -->|oui| C["IR = CA × taux VL de l'activité"]
    B -->|non| D["Revenu imposable = CA × (1 − abattement)"]
    D --> E["Applique le barème progressif au quotient: barème(imposable / parts) × parts"]
    C --> F[Montant IR renvoyé]
    E --> F
```

## 3. Détermination du statut TVA

```mermaid
flowchart TD
    A[Chiffre d'affaires] --> B{Type d'activité}
    B -->|Services| C{CA ≤ 37 500 € ?}
    B -->|Vente| D{CA ≤ 85 000 € ?}
    C -->|oui| E[Franchise en base: pas de TVA]
    C -->|non| F[Assujetti: TVA à facturer]
    D -->|oui| E
    D -->|non| F
```
