import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import * as Print from 'expo-print';

const SimplePDFViewer = ({ source, onLoadComplete, onError }) => {
  const openPDF = async () => {
    try {
      console.log('🔄 Tentative d\'ouverture PDF:', source);
      
      // Vérifier le type de source
      let uri = source;
      if (source && source.uri) {
        uri = source.uri;
      }
      
      // Si c'est un require (asset), essayer expo-print
      if (typeof uri === 'number') {
        console.log('📄 Asset PDF détecté');
        await Print.printAsync({
          uri: uri,
        });
      } else if (typeof uri === 'string') {
        // Si c'est une URL, ouvrir dans le navigateur
        console.log('🌐 URL PDF détectée:', uri);
        await Linking.openURL(uri);
      }
      
      // Appeler le callback de succès
      if (onLoadComplete) {
        onLoadComplete(1, uri);
      }
      
      console.log('✅ PDF ouvert avec succès');
    } catch (err) {
      console.error('❌ Erreur ouverture PDF:', err);
      if (onError) {
        onError(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PDF Disponible</Text>
      <Text style={styles.subtitle}>Cliquez pour ouvrir le document</Text>
      <TouchableOpacity onPress={openPDF} style={styles.button}>
        <Text style={styles.buttonText}>Ouvrir le PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SimplePDFViewer;