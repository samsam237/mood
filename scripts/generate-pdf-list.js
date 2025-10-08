const fs = require('fs');
const path = require('path');

// Chemins
const pdfsDir = path.join(__dirname, '../public/assets/pdfs');
const outputFile = path.join(__dirname, '../public/data/pdf-catalog.json');

// Fonction pour scanner un dossier
function scanPdfDirectory(dirPath, category) {
  const files = fs.readdirSync(dirPath);
  const pdfs = [];

  files.forEach((file, index) => {
    if (file.toLowerCase().endsWith('.pdf')) {
      // Générer un titre lisible à partir du nom de fichier
      let title = file.replace('.pdf', '');
      
      // Nettoyer le titre
      title = title
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Déterminer l'icône selon le contenu
      let icon = 'description';
      
      if (category === 'hydratation') {
        const icons = ['water-drop', 'local-drink', 'opacity', 'invert-colors', 
                       'analytics', 'health-and-safety', 'favorite', 'info'];
        icon = icons[index % icons.length];
      } else {
        // Pour les exercices, choisir selon le titre
        if (title.includes('EQUILIBRE') || title.includes('ÉQUILIBRE')) icon = 'accessibility';
        else if (title.includes('CHAISE')) icon = 'event-seat';
        else if (title.includes('ABDOMINAUX') || title.includes('ABDOMINALE')) icon = 'fitness-center';
        else if (title.includes('MEMBRES INFÉRIEURS') || title.includes('MEMBRES INFERIEURS')) icon = 'directions-walk';
        else if (title.includes('MEMBRES SUPÉRIEURS') || title.includes('SUPERIEURS')) icon = 'back-hand';
        else if (title.includes('SOUPLESSE')) icon = 'self-improvement';
        else if (title.includes('MOBILISATION')) icon = 'sync';
        else if (title.includes('BALLON')) icon = 'sports-baseball';
        else if (title.includes('GYM')) icon = 'fitness-center';
        else if (title.includes('PREVENTION') || title.includes('PRÉVENTION')) icon = 'health-and-safety';
        else if (title.includes('SPORT') || title.includes('AP-recos')) icon = 'sports';
        else icon = 'assignment';
      }

      pdfs.push({
        id: index + 1,
        title: title,
        file: `${category}/${file}`,
        icon: icon
      });
    }
  });

  return pdfs;
}

// Scanner les deux dossiers
try {
  console.log('🔍 Scanning PDF directories...\n');

  const hydratationPath = path.join(pdfsDir, 'hydratation');
  const exercicePath = path.join(pdfsDir, 'exercice');

  const hydratationDocs = scanPdfDirectory(hydratationPath, 'hydratation');
  const exerciceDocs = scanPdfDirectory(exercicePath, 'exercice');

  const catalog = {
    hydratation: hydratationDocs,
    exercices: exerciceDocs,
    metadata: {
      totalDocuments: hydratationDocs.length + exerciceDocs.length,
      hydratationCount: hydratationDocs.length,
      exercicesCount: exerciceDocs.length,
      lastUpdated: new Date().toISOString(),
    }
  };

  // Créer le dossier data s'il n'existe pas
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Écrire le fichier JSON
  fs.writeFileSync(outputFile, JSON.stringify(catalog, null, 2));

  console.log('✅ PDF catalog generated successfully!\n');
  console.log(`📊 Statistics:`);
  console.log(`   - Hydratation: ${hydratationDocs.length} documents`);
  console.log(`   - Exercices: ${exerciceDocs.length} documents`);
  console.log(`   - Total: ${catalog.metadata.totalDocuments} documents`);
  console.log(`\n📁 Output: ${outputFile}\n`);

} catch (error) {
  console.error('❌ Error generating PDF catalog:', error);
  process.exit(1);
}

