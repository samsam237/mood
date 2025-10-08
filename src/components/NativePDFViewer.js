import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Pdf from 'react-native-pdf';

const NativePDFViewer = ({ source, onLoadComplete, onError }) => {
  
  // Convertir le chemin pour les assets Android
  const getPdfSource = () => {
    if (Platform.OS === 'android') {
      // Chemins des assets Android
      // /assets/pdfs/hydratation/1.pdf → file:///android_asset/pdfs/hydratation/1.pdf
      const assetPath = source.uri.replace('/assets/', '');
      return { uri: `bundle-assets://${assetPath}`, cache: true };
    }
    return source;
  };

  return (
    <Pdf
      source={getPdfSource()}
      onLoadComplete={(numberOfPages, filePath) => {
        console.log(`PDF chargé: ${numberOfPages} pages`);
        if (onLoadComplete) {
          onLoadComplete(numberOfPages, filePath);
        }
      }}
      onPageChanged={(page, numberOfPages) => {
        console.log(`Page ${page}/${numberOfPages}`);
      }}
      onError={(error) => {
        console.error('Erreur PDF:', error);
        if (onError) {
          onError(error);
        }
      }}
      style={styles.pdf}
      trustAllCerts={false}
      enablePaging={true}
      spacing={10}
      minScale={1.0}
      maxScale={3.0}
    />
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default NativePDFViewer;

