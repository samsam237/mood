// Polyfill pour résoudre l'erreur Systrace
// Ce fichier fournit une implémentation de base pour Systrace

const Systrace = {
  beginEvent: (name, args) => {
    // Implémentation vide pour le développement
    if (__DEV__) {
      console.log(`[Systrace] beginEvent: ${name}`, args);
    }
  },
  
  endEvent: () => {
    // Implémentation vide pour le développement
    if (__DEV__) {
      console.log('[Systrace] endEvent');
    }
  },
  
  measure: (name, fn) => {
    // Implémentation basique qui exécute simplement la fonction
    return fn();
  },
  
  measureMethods: (object, methods) => {
    // Implémentation basique qui retourne l'objet tel quel
    return object;
  },
  
  counterEvent: (name, value) => {
    // Implémentation vide pour le développement
    if (__DEV__) {
      console.log(`[Systrace] counterEvent: ${name} = ${value}`);
    }
  },
  
  setEnabled: (enabled) => {
    // Implémentation vide
  },
  
  isEnabled: () => {
    return false;
  },
  
  // Ajouter d'autres méthodes si nécessaire
  mark: () => {},
  beginAsyncEvent: () => {},
  endAsyncEvent: () => {},
};

export default Systrace;




