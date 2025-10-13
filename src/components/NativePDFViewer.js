import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import * as Print from 'expo-print';

const SimplePDFViewer = ({ source, onError }) => {
  const openPDF = async () => {
    try {
      // Solution directe - expo-print peut parfois gérer les require() directement
      await Print.printAsync({
        uri: source, // ou source.uri selon votre structure
      });
    } catch (err) {
      console.error('❌ Erreur ouverture PDF:', err);
      if (onError) {
        onError(err);
      }
      
      // Fallback: Ouvrir dans le navigateur si c'est une URL
      if (typeof source === 'string' && source.startsWith('http')) {
        Linking.openURL(source);
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