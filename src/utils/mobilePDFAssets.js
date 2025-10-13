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
  
  // Exercices (10 sélectionnés)
  'exercice/10.pdf': require('../../assets/pdfs/exercice/10.pdf'),
  'exercice/6.pdf': require('../../assets/pdfs/exercice/6.pdf'),
  'exercice/A1.pdf': require('../../assets/pdfs/exercice/A1.pdf'),
  'exercice/D.pdf': require('../../assets/pdfs/exercice/D.pdf'),
  
  // PDFs avec caractères spéciaux (6 sélectionnés)
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

