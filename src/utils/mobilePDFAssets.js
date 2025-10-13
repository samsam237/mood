// Mapping des PDFs pour mobile - utilise les assets require()
const mobilePDFAssets = {
  // Hydratation
  'hydratation/1.pdf': require('../../assets/pdfs/hydratation/1.pdf'),
  'hydratation/2.pdf': require('../../assets/pdfs/hydratation/2.pdf'),
  'hydratation/3.pdf': require('../../assets/pdfs/hydratation/3.pdf'),
  'hydratation/4.pdf': require('../../assets/pdfs/hydratation/4.pdf'),
  'hydratation/5.pdf': require('../../assets/pdfs/hydratation/5.pdf'),
  'hydratation/6.pdf': require('../../assets/pdfs/hydratation/6.pdf'),
  'hydratation/7.pdf': require('../../assets/pdfs/hydratation/7.pdf'),
  'hydratation/9.pdf': require('../../assets/pdfs/hydratation/9.pdf'),
  
  // Exercices
  'exercice/10.pdf': require('../../assets/pdfs/exercice/10.pdf'),
  'exercice/6.pdf': require('../../assets/pdfs/exercice/6.pdf'),
  'exercice/A1.pdf': require('../../assets/pdfs/exercice/A1.pdf'),
  'exercice/D.pdf': require('../../assets/pdfs/exercice/D.pdf'),
  'exercice/L1.pdf': require('../../assets/pdfs/exercice/L1.pdf'),
  'exercice/N1.pdf': require('../../assets/pdfs/exercice/N1.pdf'),
  
  // Exercices avec espaces dans les noms (échappés)
  'exercice/ECHAUFFEMENT ARTICULAIRE SUR CHAISE.pdf': require('../../assets/pdfs/exercice/ECHAUFFEMENT ARTICULAIRE SUR CHAISE.pdf'),
  'exercice/ENTRETIEN DE L_ÉQUILIBRE 1.pdf': require('../../assets/pdfs/exercice/ENTRETIEN DE L_ÉQUILIBRE 1.pdf'),
  'exercice/ENTRETIEN DE L_EQUILIBRE 2.pdf': require('../../assets/pdfs/exercice/ENTRETIEN DE L_EQUILIBRE 2.pdf'),
  'exercice/ENTRETIEN DE L_ÉQUILIBRE 3.pdf': require('../../assets/pdfs/exercice/ENTRETIEN DE L_ÉQUILIBRE 3.pdf'),
  'exercice/EQUILIBRE DES MEMBRES INFÉRIEURS.pdf': require('../../assets/pdfs/exercice/EQUILIBRE DES MEMBRES INFÉRIEURS.pdf'),
  'exercice/EXERCICE BALLON PAILLE 2.pdf': require('../../assets/pdfs/exercice/EXERCICE BALLON PAILLE 2.pdf'),
  'exercice/EXERCICE BALLON PAILLE 3.pdf': require('../../assets/pdfs/exercice/EXERCICE BALLON PAILLE 3.pdf'),
  'exercice/EXERCICE BALLON PAILLE.pdf': require('../../assets/pdfs/exercice/EXERCICE BALLON PAILLE.pdf'),
  'exercice/EXERCICE GLOBAL.pdf': require('../../assets/pdfs/exercice/EXERCICE GLOBAL.pdf'),
  'exercice/GYM À DEUX.pdf': require('../../assets/pdfs/exercice/GYM À DEUX.pdf'),
  'exercice/GYM SUR CHAISE.pdf': require('../../assets/pdfs/exercice/GYM SUR CHAISE.pdf'),
  'exercice/MOBILISATION ARTICULAIRE BAS DU CORPS.pdf': require('../../assets/pdfs/exercice/MOBILISATION ARTICULAIRE BAS DU CORPS.pdf'),
  'exercice/MOBILISATION ARTICULAIRE HAUT DU CORPS.pdf': require('../../assets/pdfs/exercice/MOBILISATION ARTICULAIRE HAUT DU CORPS.pdf'),
  'exercice/MOBILISATION DES DOIGTS ET DES MAINS.pdf': require('../../assets/pdfs/exercice/MOBILISATION DES DOIGTS ET DES MAINS.pdf'),
  'exercice/MOBILISATION DES MEMBRES SUPERIEURS.pdf': require('../../assets/pdfs/exercice/MOBILISATION DES MEMBRES SUPERIEURS.pdf'),
  'exercice/MOBILISATION DES MEMBRES SUR CHAISE.pdf': require('../../assets/pdfs/exercice/MOBILISATION DES MEMBRES SUR CHAISE.pdf'),
  'exercice/MOBILISATION DES POIGNETS.pdf': require('../../assets/pdfs/exercice/MOBILISATION DES POIGNETS.pdf'),
  'exercice/PREVENTION DES CHUTES.pdf': require('../../assets/pdfs/exercice/PREVENTION DES CHUTES.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE DE LA SANGLE ABDOMINALE.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE DE LA SANGLE ABDOMINALE.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE DES ABDOMINAUX.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE DES ABDOMINAUX.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE DES MEMBRES INFÉRIEURS 2.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE DES MEMBRES INFÉRIEURS 2.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE DES MEMBRES INFERIEURS.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE DES MEMBRES INFERIEURS.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE DES MEMBRES INFÉRIEURS.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE DES MEMBRES INFÉRIEURS.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE DES SUPERIEURS.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE DES SUPERIEURS.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE MEMBRES INFÉRIEURS 1.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE MEMBRES INFÉRIEURS 1.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE MEMBRES INFÉRIEURS.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE MEMBRES INFÉRIEURS.pdf'),
  'exercice/RENFORCEMENT MUSCULAIRE MEMBRES SUPÉRIEURS.pdf': require('../../assets/pdfs/exercice/RENFORCEMENT MUSCULAIRE MEMBRES SUPÉRIEURS.pdf'),
  'exercice/RENFORCEMENTS MUSCULAIRE DE MEMBRES INFÉRIEUR 3.pdf': require('../../assets/pdfs/exercice/RENFORCEMENTS MUSCULAIRE DE MEMBRES INFÉRIEUR 3.pdf'),
  'exercice/RENFORCEMENTS MUSCULAIRE DE MEMBRES INFÉRIEUR 4.pdf': require('../../assets/pdfs/exercice/RENFORCEMENTS MUSCULAIRE DE MEMBRES INFÉRIEUR 4.pdf'),
  'exercice/SOUPLESSE BAS DU CORPS.pdf': require('../../assets/pdfs/exercice/SOUPLESSE BAS DU CORPS.pdf'),
  'exercice/SOUPLESSE DOIGTS ET ORTEILS.pdf': require('../../assets/pdfs/exercice/SOUPLESSE DOIGTS ET ORTEILS.pdf'),
  
  // PDFs avec caractères spéciaux
  'exercice/AP-recos-sport-sante-adultes-seniors  1111.pdf': require('../../assets/pdfs/exercice/AP-recos-sport-sante-adultes-seniors  1111.pdf'),
  'exercice/AP-recos-sport-sante-bebes22222.pdf': require('../../assets/pdfs/exercice/AP-recos-sport-sante-bebes22222.pdf'),
  'exercice/AP-recos-sport-sante-enfants-ados3333.pdf': require('../../assets/pdfs/exercice/AP-recos-sport-sante-enfants-ados3333.pdf'),
  'exercice/AP-recos-sport-sante-femmes-enceintes4444.pdf': require('../../assets/pdfs/exercice/AP-recos-sport-sante-femmes-enceintes4444.pdf'),
  'exercice/AP-recos-sport-sante-handicap-adultes5555.pdf': require('../../assets/pdfs/exercice/AP-recos-sport-sante-handicap-adultes5555.pdf'),
  'exercice/AP-recos-sport-sante-post-partum6666.pdf': require('../../assets/pdfs/exercice/AP-recos-sport-sante-post-partum6666.pdf'),
};

/**
 * Obtient l'asset PDF pour mobile
 * @param {string} filePath - Chemin du fichier (ex: "hydratation/1.pdf")
 * @returns {number|null} L'asset require ou null si non trouvé
 */
export const getMobilePDFAsset = (filePath) => {
  console.log('🔍 Recherche asset mobile pour:', filePath);
  
  const asset = mobilePDFAssets[filePath];
  if (asset) {
    console.log('✅ Asset trouvé:', asset);
    return asset;
  } else {
    console.warn('❌ Asset non trouvé pour:', filePath);
    return null;
  }
};

/**
 * Vérifie si un PDF existe dans les assets mobiles
 * @param {string} filePath - Chemin du fichier
 * @returns {boolean} True si existe
 */
export const mobilePDFExists = (filePath) => {
  return !!mobilePDFAssets[filePath];
};

export default mobilePDFAssets;

