import storageService from './storageService';

export const addWaterIntake = async (quantity = 100) => {
    const storage = await storageService.initializeStorage();
    const today = new Date().toDateString();
    const key = `hydration-${today}`;
    const current = parseInt((await storage.get(key)) || '0', 10);
    await storage.set(key, current + quantity); // en mL
};

export const addMovement = async () => {
    const storage = await storageService.initializeStorage();
    const today = new Date().toDateString();
    const key = `movement-${today}`;
    const current = parseInt((await storage.get(key)) || '0', 10);
    await storage.set(key, current + 1);
};
  
export const getDailyStats = async () => {
    const storage = await storageService.initializeStorage();
    const today = new Date().toDateString();
    const hydration = parseInt((await storage.get(`hydration-${today}`)) || '0', 10);
    const movement = parseInt((await storage.get(`movement-${today}`)) || '0', 10);
    const goalHydration = parseInt((await storage.get('goalHydration')) || '3000', 10); // en mL
    const goalMovement = parseInt((await storage.get('goalMovement')) || '12', 10);
    return { hydration, movement, goalHydration, goalMovement };
};
  
export const getStatsForLastDays = async (days = 7) => {
    const storage = await storageService.initializeStorage();
    const results = [];
  
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toDateString();
      
      const hydration = parseInt(await storage.get(`hydration-${key}`) || '0');
      const movement = parseInt(await storage.get(`movement-${key}`) || '0');
  
      results.push({
        date: key.slice(4, 10), // "May 15"
        hydration: hydration / 1000, // en litres
        movement
      });
    }
  
    return results;
};
  
  