// utils/pdfAssets.js

export const pdfAssets = {
    // === HYDRATATION ===
    hydratation_1: require('../../assets/pdfs/hydratation/1.pdf'),
    hydratation_2: require('../../assets/pdfs/hydratation/2.pdf'),
    hydratation_3: require('../../assets/pdfs/hydratation/3.pdf'),
    hydratation_4: require('../../assets/pdfs/hydratation/4.pdf'),
    hydratation_5: require('../../assets/pdfs/hydratation/5.pdf'),
    hydratation_6: require('../../assets/pdfs/hydratation/6.pdf'),
    hydratation_7: require('../../assets/pdfs/hydratation/7.pdf'),
  /*   hydratation_8: require('../../assets/pdfs/hydratation/8.pdf'), */
 /*    hydratation_9: require('../../assets/pdfs/hydratation/9.pdf'), */
  /*   hydratation_10: require('../../assets/pdfs/hydratation/10.pdf'), */
  
    // === EXERCICE ===
/*     exercice_1: require('../../assets/pdfs/exercice/1.pdf'),
    exercice_2: require('../../assets/pdfs/exercice/2.pdf'),
    exercice_3: require('../../assets/pdfs/exercice/3.pdf'),
    exercice_4: require('../../assets/pdfs/exercice/4.pdf'),
    exercice_5: require('../../assets/pdfs/exercice/5.pdf'),
    exercice_6: require('../../assets/pdfs/exercice/6.pdf'),
    exercice_7: require('../../assets/pdfs/exercice/7.pdf'),
    exercice_8: require('../../assets/pdfs/exercice/8.pdf'),
    exercice_9: require('../../assets/pdfs/exercice/9.pdf'),
    exercice_10: require('../../assets/pdfs/exercice/10.pdf'), */
  
    // Ajoute d'autres catégories si nécessaire
    // nutrition_1: require('../../assets/pdfs/nutrition/1.pdf'),
    // ... etc
  };
  
  /**
   * Obtient un asset PDF par catégorie et numéro
   * @param {string} category - 'hydratation', 'exercice', etc.
   * @param {number|string} number - Numéro du PDF
   * @returns {number} L'asset require
   */
  export const getPdfAsset = (category, number) => {
    const key = `${category}_${number}`;
    if (!pdfAssets[key]) {
      console.warn(`❌ PDF non trouvé: ${key}`);
      throw new Error(`PDF non trouvé: ${category} - ${number}`);
    }
    return pdfAssets[key];
  };
  
  /**
   * Obtient tous les PDFs d'une catégorie
   * @param {string} category - 'hydratation', 'exercice', etc.
   * @returns {Array} Liste des PDFs de la catégorie
   */
  export const getPdfsByCategory = (category) => {
    const pdfs = [];
    let i = 1;
    
    while (true) {
      const key = `${category}_${i}`;
      if (pdfAssets[key]) {
        pdfs.push({
          id: i,
          key: key,
          asset: pdfAssets[key],
          title: `${category} - Partie ${i}`
        });
        i++;
      } else {
        break;
      }
    }
    
    return pdfs;
  };
  
  /**
   * Liste toutes les catégories disponibles
   * @returns {Array} Liste des catégories
   */
  export const getAvailableCategories = () => {
    const categories = new Set();
    Object.keys(pdfAssets).forEach(key => {
      const category = key.split('_')[0];
      categories.add(category);
    });
    return Array.from(categories);
  };
  
  /**
   * Vérifie si un PDF existe
   * @param {string} category - Catégorie
   * @param {number|string} number - Numéro
   * @returns {boolean} True si existe
   */
  export const pdfExists = (category, number) => {
    const key = `${category}_${number}`;
    return !!pdfAssets[key];
  };
  
  export default pdfAssets;