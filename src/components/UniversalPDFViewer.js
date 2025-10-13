import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import WebPDFViewer from './web/WebPDFViewer';
import MobilePDFViewer from './MobilePDFViewer';

/**
 * Viewer PDF universel qui s'adapte automatiquement à la plateforme
 */
const UniversalPDFViewer = ({ source, onLoadComplete, onError, style }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simuler un délai de chargement initial
    const timer = setTimeout(() => {
      setLoading(false);
      if (onLoadComplete) {
        onLoadComplete(1, source?.uri || source);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [source]);

  const handleError = (err) => {
    console.error('❌ Erreur PDF Viewer:', err);
    setError(true);
    setLoading(false);
    
    if (onError) {
      onError(err);
    }
  };

  const handleLoadComplete = (pages, uri) => {
    console.log('✅ PDF chargé avec succès:', uri);
    setLoading(false);
    setError(false);
    
    if (onLoadComplete) {
      onLoadComplete(pages, uri);
    }
  };

  // Si erreur, afficher un message d'erreur avec options
  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>Impossible de charger le PDF</Text>
          <Text style={styles.errorSubtext}>
            Vérifiez votre connexion internet ou essayez de nouveau
          </Text>
          
          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <Text 
              style={styles.actionButton}
              onPress={() => {
                setError(false);
                setLoading(true);
                // Relancer le chargement
                setTimeout(() => setLoading(false), 1000);
              }}
            >
              🔄 Réessayer
            </Text>
            
            <Text 
              style={styles.actionButton}
              onPress={() => {
                // Ouvrir dans le navigateur externe
                const url = source?.uri || source;
                if (url && typeof url === 'string') {
                  Linking.openURL(url);
                }
              }}
            >
              🌐 Ouvrir dans le navigateur
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Si en cours de chargement
  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="picture-as-pdf" size={48} color={theme.colors.primary} />
          <Text style={styles.loadingText}>Préparation du PDF...</Text>
          <Text style={styles.loadingSubtext}>Chargement en cours</Text>
        </View>
      </View>
    );
  }

  // Construire l'URL complète pour le web
  const getFullUrl = (src) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
      // Si c'est une URL relative, construire l'URL complète
      if (src?.uri && src.uri.startsWith('/')) {
        const baseUrl = window.location.origin;
        return { ...src, uri: `${baseUrl}${src.uri}` };
      }
    }
    return src;
  };

  const finalSource = getFullUrl(source);
  console.log('🌐 Source finale pour viewer:', finalSource);

  // Rendu selon la plateforme
  if (Platform.OS === 'web') {
    return (
      <WebPDFViewer
        source={finalSource}
        onLoadComplete={handleLoadComplete}
        onError={handleError}
        style={style}
      />
    );
  } else {
    // Sur mobile, utiliser le viewer mobile optimisé
    return (
      <MobilePDFViewer
        source={finalSource}
        onLoadComplete={handleLoadComplete}
        onError={handleError}
        style={style}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  actionButton: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '15',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
});

export default UniversalPDFViewer;
