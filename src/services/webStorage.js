// Web-compatible storage service that mimics expo-secure-store API
export const webStorage = {
  async getItemAsync(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },
  
  async setItemAsync(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      throw error;
    }
  },
  
  async deleteItemAsync(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting item from localStorage:', error);
      throw error;
    }
  }
};

// Export as default for compatibility
export default webStorage;
