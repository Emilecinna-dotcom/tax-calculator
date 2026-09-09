import { useState } from 'react';
import { Save, Check } from 'lucide-react';

/** Bouton « Enregistrer cette simulation » — confirmation brève inline plutôt
 * qu'un toast, pour rester sans dépendance supplémentaire. */
export function SaveButton({ onSave }: { onSave: () => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        onSave();
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }}
      className="print:hidden flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {saved ? <Check className="size-3.5 text-green-600 dark:text-green-400" /> : <Save className="size-3.5" />}
      {saved ? 'Enregistré' : 'Enregistrer'}
    </button>
  );
}
