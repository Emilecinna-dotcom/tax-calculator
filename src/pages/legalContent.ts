// Contenu centralisé des pages légales, pour éviter toute duplication entre
// Mentions légales et Politique de confidentialité (principe DRY).

export const SITE_URL = 'https://tax-calculator-dusky-ten.vercel.app';
export const EDITEUR_NOM = 'Audric Cinna';
export const EDITEUR_CONTACT = 'emile.cinna@icloud.com';
export const HEBERGEUR = {
  nom: 'Vercel Inc.',
  adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
  site: 'https://vercel.com',
};

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export const MENTIONS_LEGALES: LegalSection[] = [
  {
    title: 'Éditeur du site',
    paragraphs: [
      `Ce site est édité à titre non professionnel par ${EDITEUR_NOM}.`,
      `Contact : ${EDITEUR_CONTACT}`,
    ],
  },
  {
    title: 'Hébergement',
    paragraphs: [
      `Ce site est hébergé par ${HEBERGEUR.nom}, ${HEBERGEUR.adresse}.`,
    ],
  },
  {
    title: "Nature de l'outil",
    paragraphs: [
      'Ce simulateur fournit une estimation indicative des cotisations et impôts pour les auto-entrepreneurs en France, basée sur les taux URSSAF en vigueur.',
      "Il ne remplace pas l'avis d'un expert-comptable et ne constitue pas un conseil fiscal personnalisé.",
    ],
  },
];

export const POLITIQUE_CONFIDENTIALITE: LegalSection[] = [
  {
    title: 'Données saisies dans le simulateur',
    paragraphs: [
      "Les données que vous saisissez (chiffre d'affaires, charges, type d'activité) sont traitées uniquement dans votre navigateur, pour calculer votre estimation.",
      "Elles ne sont ni envoyées à un serveur, ni stockées, ni transmises à un tiers.",
    ],
  },
  {
    title: 'Mesure d\'audience',
    paragraphs: [
      "Ce site utilise Plausible Analytics, un outil de mesure d'audience respectueux de la vie privée : aucun cookie n'est déposé et aucune donnée personnelle identifiable n'est collectée.",
      "Ce mode de fonctionnement ne nécessite pas de bandeau de consentement au titre du RGPD.",
    ],
  },
  {
    title: 'Vos droits',
    paragraphs: [
      `Pour toute question relative à vos données, vous pouvez contacter ${EDITEUR_CONTACT}.`,
    ],
  },
];
