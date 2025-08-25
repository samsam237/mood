// src/pages/home/slidesContent.ts
export type SlideItem = {
  id: string;
  title: string;
  bodyHtml: string[];   // chaque entrée = un bloc HTML
  pdf?: string;
};

export const slides: SlideItem[] = [
  {
    id: 'def-sedentarite',
    title: 'Définition – Sédentarité',
    bodyHtml: [
      "<strong>Sédentarité</strong> : comportements assis/allongés en période d’éveil avec dépense ≤ <strong>1,5 MET</strong>.",
      "<ul><li>Exemples : travail assis prolongé</li><li>Temps d’écran (TV, PC)</li><li>Transports motorisés longs</li></ul>"
    ],
    pdf: '/assets/pdfs/3.pdf'
  },
  {
    id: 'def-activite-physique',
    title: 'Définition – Activité physique',
    bodyHtml: [
      "<strong>Activité physique</strong> : tout mouvement des muscles squelettiques entraînant une dépense d’énergie supérieure au repos.",
      "<ul><li>Marche</li><li>Vélo</li><li>Sport</li><li>Ménage actif</li></ul>"
    ],
    pdf: '/assets/pdfs/3.pdf'
  },
  {
    id: 'risques-inactivite',
    title: "Risques de l'inactivité & de la sédentarité",
    bodyHtml: [
      "<ul>" +
      "<li><strong>Maladies</strong> : cardiovasculaires, diabète type 2, obésité, certains cancers</li>" +
      "<li><strong>Mental</strong> : anxiété, dépression, baisse du sommeil & bien-être</li>" +
      "<li><strong>Mortalité toutes causes</strong> (effet cumulatif avec le temps assis)</li>" +
      "</ul>"
    ],
    pdf: '/assets/pdfs/2.pdf'
  },
  {
    id: 'reco-oms',
    title: "Recommandations OMS (Adultes 18–64 ans)",
    bodyHtml: [
      "<ul>" +
      "<li>150–300 min/semaine d’activité <strong>modérée</strong> ou 75–150 min <strong>vigoureuse</strong></li>" +
      "<li>Renforcement musculaire ≥ 2 jours/semaine</li>" +
      "<li>Réduire le temps assis ; <strong>toute activité vaut mieux que rien</strong></li>" +
      "<li>65+ : ajouter équilibre/renforcement pour prévenir les chutes</li>" +
      "</ul>"
    ],
    pdf: '/assets/pdfs/7.pdf'
  }
];
