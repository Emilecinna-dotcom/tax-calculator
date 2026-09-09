// Historique local des simulations : rien n'est envoyé où que ce soit, tout
// reste dans le localStorage du navigateur (même principe de confidentialité
// que le reste de l'appli, voir la politique de confidentialité).

const STORAGE_KEY = 'tax-calculator:history';
const MAX_ENTRIES = 10;

export interface HistoryEntry<TPayload = unknown> {
  id: string;
  date: string; // ISO
  regime: 'auto_entrepreneur' | 'salarie';
  label: string;
  netAfter: number;
  payload: TPayload;
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryEntry<TPayload>(
  entry: Omit<HistoryEntry<TPayload>, 'id' | 'date'>,
): HistoryEntry<TPayload>[] {
  // Le JSON relu de localStorage est de toute façon non typé au runtime ;
  // le cast reflète juste que le stockage est partagé entre régimes, chaque
  // appelant ne s'intéresse ensuite qu'aux entrées de son propre régime.
  const current = loadHistory() as HistoryEntry<TPayload>[];
  const next: HistoryEntry<TPayload>[] = [
    { ...entry, id: crypto.randomUUID(), date: new Date().toISOString() },
    ...current,
  ].slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota dépassé : tant pis, l'historique est un confort, pas une
    // donnée critique — on n'empêche jamais la simulation elle-même.
  }
  return next;
}

export function removeHistoryEntry(id: string): HistoryEntry[] {
  const next = loadHistory().filter((e) => e.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // idem
  }
  return next;
}
