import { Storage } from '@ionic/storage';
import { UserHealthStatusInterface } from '../interfaces/userHeatlhStatut';

// Define a unified profile interface
export interface UserProfile extends UserHealthStatusInterface {
  goalHydration?: number;
  goalMovement?: number;
  waterPerInterval?: number;
  movementPerInterval?: number;
  waterReminderFrequency?: number; // in minutes
  moveReminderFrequency?: number; // in minutes
}

class StorageService {
  private _storage: Storage | null = null;

  constructor() {
    this.init();
  }

  async init() {
    if (this._storage) return;
    const storage = new Storage();
    this._storage = await storage.create();
  }

  private async getStorage() {
    if (!this._storage) {
      await this.init();
    }
    return this._storage!;
  }

  public async saveUserProfile(profile: UserProfile): Promise<void> {
    const storage = await this.getStorage();
    await storage.set('userProfile', profile);
  }

  public async getUserProfile(): Promise<UserProfile | null> {
    const storage = await this.getStorage();
    return await storage.get('userProfile');
  }

  public async set(key: string, value: any): Promise<void> {
    const storage = await this.getStorage();
    await storage.set(key, value);
  }

  public async get(key: string): Promise<any> {
    const storage = await this.getStorage();
    return await storage.get(key);
  }

  public async remove(key: string): Promise<void> {
    const storage = await this.getStorage();
    await storage.remove(key);
  }

  public async calculateWaterPerInterval(): Promise<number> {
    const profile = await this.getUserProfile();
    if (!profile) return 100; // Valeur par défaut

    const { wakeTime, sleepTime, goalHydration, waterReminderFrequency } = profile;
    
    if (!wakeTime || !sleepTime || !goalHydration) return 100;

    // Calculer les heures d'éveil
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    let wakeDate = new Date();
    wakeDate.setHours(wakeHour, wakeMin, 0, 0);
    let sleepDate = new Date();
    sleepDate.setHours(sleepHour, sleepMin, 0, 0);
    if (sleepDate <= wakeDate) sleepDate.setDate(sleepDate.getDate() + 1);
    const wakingHours = (sleepDate.getTime() - wakeDate.getTime()) / (1000 * 60 * 60);

    // Calculer la fréquence des rappels
    const intervalMinutes = waterReminderFrequency || (wakingHours / 8) * 60;
    if (wakingHours <= 0 || intervalMinutes <= 0) return 100;

    // Calculer la quantité d'eau par intervalle
    const numberOfIntervals = (wakingHours * 60) / intervalMinutes;
    return Math.round(goalHydration / numberOfIntervals);
  }

  public async calculateMovementGoal(): Promise<number> {
    const profile = await this.getUserProfile();
    if (!profile) {
      console.log('Aucun profil trouvé, objectif mouvement par défaut: 12');
      return 12; // Valeur par défaut
    }

    const { wakeTime, sleepTime, moveReminderFrequency } = profile;
    
    if (!wakeTime || !sleepTime) {
      console.log('Heures manquantes, objectif mouvement par défaut: 12');
      return 12;
    }

    // Calculer les heures d'éveil
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    let wakeDate = new Date();
    wakeDate.setHours(wakeHour, wakeMin, 0, 0);
    let sleepDate = new Date();
    sleepDate.setHours(sleepHour, sleepMin, 0, 0);
    if (sleepDate <= wakeDate) sleepDate.setDate(sleepDate.getDate() + 1);
    const wakingHours = (sleepDate.getTime() - wakeDate.getTime()) / (1000 * 60 * 60);

    // Calculer la fréquence des rappels de mouvement
    const intervalMinutes = moveReminderFrequency || 60; // 60 minutes par défaut
    if (wakingHours <= 0 || intervalMinutes <= 0) {
      console.log('Calcul invalide, objectif mouvement par défaut: 12');
      return 12;
    }

    // Calculer le nombre de rappels de mouvement pendant le temps d'éveil
    const numberOfIntervals = (wakingHours * 60) / intervalMinutes;
    const goal = Math.round(numberOfIntervals);
    console.log('Objectif mouvement calculé:', goal, 'Heures éveil:', wakingHours, 'Intervalle:', intervalMinutes);
    return goal;
  }

  public async getHydrationGoal(): Promise<number> {
    const profile = await this.getUserProfile();
    const goal = profile?.goalHydration || 3000; // 3L par défaut
    console.log('Objectif hydratation:', goal, 'Profil:', profile);
    return goal;
  }
}

// Export a singleton instance of the service
export const storageService = new StorageService();
