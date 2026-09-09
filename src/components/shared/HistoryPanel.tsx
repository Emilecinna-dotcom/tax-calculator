import { History, Trash2, X } from 'lucide-react';
import { formatCurrency } from '@/lib/taxCalculations';
import type { HistoryEntry } from '@/lib/history';

interface Props<TPayload> {
  open: boolean;
  onToggle: () => void;
  entries: HistoryEntry<TPayload>[];
  onRestore: (payload: TPayload) => void;
  onDelete: (id: string) => void;
}

/** Bouton + panneau : historique local des simulations, propre à un régime
 * (le parent filtre déjà les entrées qui le concernent). */
export function HistoryPanel<TPayload>({ open, onToggle, entries, onRestore, onDelete }: Props<TPayload>) {
  return (
    <div className="print:hidden relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <History className="size-3.5" />
        Historique
        {entries.length > 0 && (
          <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">
            {entries.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border bg-popover p-2 shadow-md">
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-xs font-medium text-muted-foreground">
              Dernières simulations (sur cet appareil)
            </span>
            <button type="button" onClick={onToggle} className="text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          </div>

          {entries.length === 0 ? (
            <p className="px-1 py-3 text-xs text-muted-foreground">
              Aucune simulation enregistrée pour l'instant.
            </p>
          ) : (
            <ul className="max-h-72 space-y-1 overflow-y-auto">
              {entries.map((entry) => (
                <li key={entry.id} className="flex items-center gap-1 rounded-md hover:bg-muted">
                  <button
                    type="button"
                    onClick={() => onRestore(entry.payload)}
                    className="flex-1 px-2 py-1.5 text-left"
                  >
                    <p className="text-xs font-medium text-foreground">{entry.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      · Net {formatCurrency(entry.netAfter)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive"
                    aria-label="Supprimer cette simulation"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
