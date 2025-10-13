import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../constants/theme';

const PDFTest = () => {
  const [testResult, setTestResult] = useState(null);

  const testPDFAccess = async () => {
    const testUrl = '/assets/pdfs/hydratation/1.pdf';
    const fullUrl = `${window.location.origin}${testUrl}`;
    
    console.log('🧪 Test PDF URL:', fullUrl);
    
    try {
      const response = await fetch(fullUrl, { method: 'HEAD' });
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', response.headers);
      
      if (response.ok) {
        setTestResult('✅ PDF accessible');
        Alert.alert('Succès', 'Le PDF est accessible !');
      } else {
        setTestResult(`❌ Erreur: ${response.status}`);
        Alert.alert('Erreur', `Impossible d'accéder au PDF: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erreur test PDF:', error);
      setTestResult(`❌ Erreur: ${error.message}`);
      Alert.alert('Erreur', `Erreur de connexion: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Test d'Accès PDF</Text>
      <Text style={styles.subtitle}>Vérifier si les PDFs sont accessibles</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={testPDFAccess}>
        <Text style={styles.buttonText}>Tester l'Accès PDF</Text>
      </TouchableOpacity>
      
      {testResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>URLs de Test:</Text>
        <Text style={styles.infoText}>Relative: /assets/pdfs/hydratation/1.pdf</Text>
        <Text style={styles.infoText}>Complète: {window.location.origin}/assets/pdfs/hydratation/1.pdf</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  testButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontFamily: 'monospace',
  },
});

export default PDFTest;

