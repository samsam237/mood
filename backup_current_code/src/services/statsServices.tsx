import { storageService } from './storageService';

export const addWaterIntake = async (quantity = 100) => {
    const today = new Date().toDateString();
    const key = `hydration-${today}`;
    const current = parseInt((await storageService.get(key)) || '0', 10);
    await storageService.set(key, current + quantity); // en mL
};

export const addMovement = async () => {
    const today = new Date().toDateString();
    const key = `movement-${today}`;
    const current = parseInt((await storageService.get(key)) || '0', 10);
    await storageService.set(key, current + 1);
};
  
export const getDailyStats = async () => {
    const today = new Date().toDateString();
    const hydration = parseInt((await storageService.get(`hydration-${today}`)) || '0', 10);
    const movement = parseInt((await storageService.get(`movement-${today}`)) || '0', 10);
    
    // Récupérer les objectifs depuis le profil utilisateur
    const goalHydration = await storageService.getHydrationGoal();
    const goalMovement = await storageService.calculateMovementGoal();
    
    return { hydration, movement, goalHydration, goalMovement };
};
  
export const getStatsForLastDays = async (days = 7) => {
    const results = [];
  
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toDateString();
      
      const hydration = parseInt(await storageService.get(`hydration-${key}`) || '0');
      const movement = parseInt(await storageService.get(`movement-${key}`) || '0');
  
      results.push({
        date: key.slice(4, 10), // "May 15"
        hydration: hydration / 1000, // en litres
        movement
      });
    }
  
    return results;
};
  
  