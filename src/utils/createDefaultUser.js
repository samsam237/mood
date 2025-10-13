// Script pour créer un utilisateur par défaut dans Firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export const createDefaultUser = async () => {
  try {
    console.log('Création de l\'utilisateur par défaut...');
    
    // Créer l'utilisateur avec email et mot de passe
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'demo@moodtracker.com', 
      'demo123'
    );
    
    // Mettre à jour le profil avec un nom d'affichage
    await updateProfile(userCredential.user, {
      displayName: 'Utilisateur Demo'
    });
    
    console.log('Utilisateur par défaut créé avec succès:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('L\'utilisateur par défaut existe déjà');
      return { success: true, message: 'Utilisateur déjà existant' };
    } else {
      console.error('Erreur lors de la création de l\'utilisateur par défaut:', error);
      return { success: false, error: error.message };
    }
  }
};

// Fonction pour tester la connexion avec les identifiants par défaut
export const testDefaultLogin = async () => {
  try {
    console.log('Test de connexion avec les identifiants par défaut...');
    
    // Importer la fonction de connexion
    const { authService } = await import('../services/authService');
    
    const result = await authService.signInWithEmail('demo@moodtracker.com', 'demo123');
    
    if (result.success) {
      console.log('Connexion par défaut réussie:', result.user.email);
      // Se déconnecter après le test
      await authService.signOut();
      console.log('Déconnexion de test effectuée');
    } else {
      console.error('Échec de la connexion par défaut:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Erreur lors du test de connexion:', error);
    return { success: false, error: error.message };
  }
};
