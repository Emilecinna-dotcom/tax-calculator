import type { LegalSection } from './legalContent';

interface LegalPageProps {
  title: string;
  sections: LegalSection[];
}

/**
 * Mise en page partagée pour les pages légales (mentions légales, confidentialité).
 * Un seul composant pour éviter de dupliquer le layout entre les deux pages (DRY).
 */
export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <a href="/" className="text-sm text-muted-foreground hover:underline">
        ← Retour au simulateur
      </a>
      <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
      <div className="mt-6 space-y-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-medium">{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="mt-2 text-sm text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
