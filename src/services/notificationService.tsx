import { LocalNotifications, ScheduleEvery  } from '@capacitor/local-notifications';

export const scheduleDailyAlarms = async (startHour : number, startMinute : number, endHour: number, endMinute : number, intervalMinutes : number, body : string) => {
    const notifications = [];
    let notificationId = 1;
    const currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0, 0);
  
    while (currentTime.getHours() < endHour || (currentTime.getHours() === endHour && currentTime.getMinutes() <= endMinute)) {
      notifications.push({
        title: "Alarme Quotidienne",
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
    console.log(body);
    scheduleDailyAlarms (8, 0, 18, 0, intervalMinutes, body);    
}

const cancelAllDailyAlarms = async () => {
    const ids = Array.from({ length: 100 }, (_, i) => i + 1);
    await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
};

