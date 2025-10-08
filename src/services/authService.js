export const authService = {
  async getFacebookUserInfo(accessToken) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
      const userInfo = await response.json();
      return {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        photo: userInfo.picture?.data?.url,
      };
    } catch (error) {
      console.error('Error fetching Facebook user info:', error);
      throw error;
    }
  },

  async refreshGoogleToken() {
    try {
      // Not available in Expo Go
      console.warn('Google token refresh not available in Expo Go');
      return null;
    } catch (error) {
      console.error('Error refreshing Google token:', error);
      throw error;
    }
  },
};
