import { LocalNotifications, ScheduleEvery  } from '@capacitor/local-notifications';
import storageService from './storageService';

export const scheduleDailyAlarms = async (startHour : number, startMinute : number, endHour: number, endMinute : number, intervalMinutes : number, body : string) => {
    const notifications = [];
    let notificationId = 1;
    const currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0, 0);
  
    while (currentTime.getHours() < endHour || (currentTime.getHours() === endHour && currentTime.getMinutes() <= endMinute)) {
      notifications.push({
        title: "Rappel !!!",
        body: body,
        id: notificationId++,
        schedule: {
          at: new Date(currentTime),
          every: 'day' as ScheduleEvery ,
        },
        /* sound: "beep.aiff", */
      });
  
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
  
    await LocalNotifications.schedule({ notifications });
};
export const myScheduleDailyAlarms = async ( intervalMinutes : number, body : string) => {
  //console.log(body);
  cancelAllDailyAlarmsByBody(body);
  scheduleDailyAlarms (8, 0, 18, 0, intervalMinutes, body);    
}

const cancelAllDailyAlarms = async () => {
    const ids = Array.from({ length: 100 }, (_, i) => i + 1);
    await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
};
const cancelAllDailyAlarmsByBody = async (specificBody:string) => {
  // Récupérer toutes les notifications planifiées
  const pendingNotifications = await LocalNotifications.getPending();

  // Filtrer les notifications ayant le `body` spécifié
  const notificationsToCancel = pendingNotifications.notifications.filter(
    (notification) => notification.body === specificBody
  );

  // Annuler les notifications correspondant au `body`
  await LocalNotifications.cancel({
    notifications: notificationsToCancel.map((notification) => ({ id: notification.id }))
  });

  //console.log(`${notificationsToCancel.length} notifications annulées.`);
};

export const getReminder = async () => {
  const storage = await storageService.initializeStorage()
  const drinkTime = await storage.get('drinkReminder');
  const moveTime = await storage.get('moveReminder');

  return { drinkTime, moveTime }
};

const setReminder = async (reminderName : string, value:number) => {
  const storage = await storageService.initializeStorage()
  await storage.set(reminderName, value);
};

export const setDrinkReminder = async ( value:number) => {
  await setReminder('drinkReminder', value)
};

export const setMoveReminder = async (value:number) => {
  await setReminder('moveReminder', value)
};

const checkPendingNotifications = async () => {
  const pending = await LocalNotifications.getPending();
  console.log('Notifications en attente:', pending);
};
const requestPermissions = async () => {
  const permissionStatus = await LocalNotifications.requestPermissions();
  
  // Vérifie si la permission de notification a été accordée
  /* if (permissionStatus.status !== 'granted') {
    console.log('Permission denied for notifications');
  } else {
    console.log('Permission granted for notifications');
  } */
 console.log ("Permissions : ",permissionStatus)
};

export const initializeReminders = async () => {
  await LocalNotifications.requestPermissions();
  const storage = await storageService.initializeStorage();
  const drinkTime = await storage.get('drinkReminder');
  const moveTime = await storage.get('moveReminder');

  if (drinkTime && !isNaN(drinkTime)) {
    await myScheduleDailyAlarms(parseInt(drinkTime), "Il faut s'hydrater");
  }else{
    await myScheduleDailyAlarms(120, "Il faut s'hydrater");
  }

  if (moveTime && !isNaN(moveTime)) {
    await myScheduleDailyAlarms(parseInt(moveTime), "Il faut bouger");
  }else{
    await myScheduleDailyAlarms(60, "Il faut bouger");
  }
};