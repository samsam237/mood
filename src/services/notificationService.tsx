import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { storageService } from './storageService';
import healthTips from '../../public/data/health-tips.json';

const WATER_REMINDER_ID_OFFSET = 1000;
const MOVE_REMINDER_ID_OFFSET = 2000;
const DAILY_TIP_ID = 3000;
const DEFAULT_WATER_REMINDERS_PER_DAY = 8;

// Schedules a block of alarms within a given time range and interval
export const scheduleAlarms = async (startHour: number, startMinute: number, endHour: number, endMinute: number, intervalMinutes: number, body: string, idOffset: number) => {
    await cancelAlarmsByBody(body); // Cancel previous alarms for this type

    const notifications = [];
    let notificationId = 1 + idOffset;
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

    if (endTime <= startTime) { // Handle overnight schedules
        endTime.setDate(endTime.getDate() + 1);
    }

    let currentTime = startTime;

    while (currentTime < endTime) {
        notifications.push({
            title: "Rappel !",
            body: body,
            id: notificationId++,
            schedule: {
                at: new Date(currentTime),
                repeats: true,
                every: 'day' as ScheduleEvery
            },
            sound: "digital_alarm_clock_151920.wav",
        });
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }

    console.log(`Scheduling ${notifications.length} notifications for: "${body}"`);
    console.log('Notification times:', notifications.map(n => ({
        id: n.id,
        time: n.schedule.at,
        body: n.body
    })));
    
    if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(`Successfully scheduled ${notifications.length} notifications for: "${body}"`);
    } else {
        console.log(`No notifications to schedule for: "${body}"`);
    }
};

// Schedules the daily health tip
export const scheduleDailyTipNotification = async () => {
    await cancelAlarmsByBodyPrefix("Conseil du jour:");

    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    const scheduleTime = new Date();
    scheduleTime.setHours(9, 0, 0, 0);

    await LocalNotifications.schedule({
        notifications: [{
            title: "Conseil Santé du Jour",
            body: `Conseil du jour: ${randomTip}`,
            id: DAILY_TIP_ID,
            schedule: { at: scheduleTime, repeats: true, every: 'day' as ScheduleEvery },
            sound: "digital_alarm_clock_151920.wav"
        }]
    });
};

// Universal cancellation functions
const cancelAlarmsByBody = async (specificBody: string) => {
    const pending = await LocalNotifications.getPending();
    const toCancel = pending.notifications.filter(n => n.body === specificBody);
    if (toCancel.length > 0) {
        await LocalNotifications.cancel({ notifications: toCancel.map(n => ({ id: n.id })) });
    }
};

const cancelAlarmsByBodyPrefix = async (prefix: string) => {
    const pending = await LocalNotifications.getPending();
    const toCancel = pending.notifications.filter(n => n.body?.startsWith(prefix));
    if (toCancel.length > 0) {
        await LocalNotifications.cancel({ notifications: toCancel.map(n => ({ id: n.id })) });
    }
};

// Main function to initialize all reminders based on user profile
export const initializeReminders = async () => {
    await LocalNotifications.requestPermissions();
    const profile = await storageService.getUserProfile();

    // Always schedule the daily tip
    await scheduleDailyTipNotification();

    if (!profile || !profile.wakeTime || !profile.sleepTime) {
        console.log("User profile with wake/sleep times not found. Cannot schedule reminders.");
        return;
    }

    const [wakeHour, wakeMinute] = profile.wakeTime.split(':').map(Number);
    const [sleepHour, sleepMinute] = profile.sleepTime.split(':').map(Number);

    // --- Water Reminders ---
    let waterIntervalMinutes = profile.waterReminderFrequency; // Check for manual override
    if (!waterIntervalMinutes) {
        // Automatic calculation if no manual frequency is set
        let wakeDate = new Date();
        wakeDate.setHours(wakeHour, wakeMinute, 0, 0);
        let sleepDate = new Date();
        sleepDate.setHours(sleepHour, sleepMinute, 0, 0);

        if (sleepDate <= wakeDate) { // Handle overnight
            sleepDate.setDate(sleepDate.getDate() + 1);
        }

        const wakingMillis = sleepDate.getTime() - wakeDate.getTime();
        const wakingHours = wakingMillis / (1000 * 60 * 60);
        
        // Calculate appropriate number of reminders based on waking hours
        // More waking hours = more frequent reminders, but not too frequent
        let remindersPerDay = Math.max(4, Math.min(12, Math.round(wakingHours / 2)));
        waterIntervalMinutes = Math.round((wakingHours / remindersPerDay) * 60);
    }

    // Use calculated interval or default to 30 minutes if not set
    // No restrictions - user has full control over reminder frequency
    waterIntervalMinutes = waterIntervalMinutes || 30;
    
    console.log('Scheduling water reminders with interval:', waterIntervalMinutes, 'minutes');
    console.log('Water reminder details:', {
        wakeTime: `${wakeHour}:${wakeMinute}`,
        sleepTime: `${sleepHour}:${sleepMinute}`,
        intervalMinutes: waterIntervalMinutes,
        body: "Il est temps de s'hydrater !",
        idOffset: WATER_REMINDER_ID_OFFSET
    });
    await scheduleAlarms(
        wakeHour, wakeMinute, 
        sleepHour, sleepMinute, 
        waterIntervalMinutes, 
        "Il est temps de s'hydrater !", 
        WATER_REMINDER_ID_OFFSET
    );

    // --- Move Reminders ---
    // No restrictions - user has full control over reminder frequency
    const moveIntervalMinutes = profile.moveReminderFrequency || 60; // Default to 60 minutes if not set
    console.log('Scheduling move reminders with interval:', moveIntervalMinutes, 'minutes');
    console.log('Move reminder details:', {
        wakeTime: `${wakeHour}:${wakeMinute}`,
        sleepTime: `${sleepHour}:${sleepMinute}`,
        intervalMinutes: moveIntervalMinutes,
        body: "Un petit mouvement s'impose !",
        idOffset: MOVE_REMINDER_ID_OFFSET
    });
    await scheduleAlarms(
        wakeHour, wakeMinute, 
        sleepHour, sleepMinute, 
        moveIntervalMinutes, 
        "Un petit mouvement s'impose !", 
        MOVE_REMINDER_ID_OFFSET
    );
};

// Get next notification times for countdown display
export const getNextNotificationTimes = async () => {
    const profile = await storageService.getUserProfile();
    if (!profile || !profile.wakeTime || !profile.sleepTime) {
        return { nextWater: null, nextMove: null };
    }

    const [wakeHour, wakeMinute] = profile.wakeTime.split(':').map(Number);
    const [sleepHour, sleepMinute] = profile.sleepTime.split(':').map(Number);
    const now = new Date();
    
    // Calculate water interval
    let waterIntervalMinutes = profile.waterReminderFrequency;
    if (!waterIntervalMinutes) {
        let wakeDate = new Date();
        wakeDate.setHours(wakeHour, wakeMinute, 0, 0);
        let sleepDate = new Date();
        sleepDate.setHours(sleepHour, sleepMinute, 0, 0);
        if (sleepDate <= wakeDate) sleepDate.setDate(sleepDate.getDate() + 1);
        const wakingHours = (sleepDate.getTime() - wakeDate.getTime()) / (1000 * 60 * 60);
        
        // Calculate appropriate number of reminders based on waking hours
        let remindersPerDay = Math.max(4, Math.min(12, Math.round(wakingHours / 2)));
        waterIntervalMinutes = Math.round((wakingHours / remindersPerDay) * 60);
    }
    waterIntervalMinutes = waterIntervalMinutes || 30;
    
    const moveIntervalMinutes = profile.moveReminderFrequency || 60;
    
    // Calculate next water notification
    const nextWater = calculateNextNotification(now, wakeHour, wakeMinute, sleepHour, sleepMinute, waterIntervalMinutes);
    const nextMove = calculateNextNotification(now, wakeHour, wakeMinute, sleepHour, sleepMinute, moveIntervalMinutes);
    
    return { nextWater, nextMove };
};

const calculateNextNotification = (now: Date, wakeHour: number, wakeMinute: number, sleepHour: number, sleepMinute: number, intervalMinutes: number) => {
    const today = new Date();
    const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), wakeHour, wakeMinute);
    const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), sleepHour, sleepMinute);
    
    if (endTime <= startTime) {
        endTime.setDate(endTime.getDate() + 1);
    }
    
    // If we're before wake time, next notification is at wake time
    if (now < startTime) {
        return startTime;
    }
    
    // If we're after sleep time, next notification is tomorrow at wake time
    if (now >= endTime) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), wakeHour, wakeMinute);
    }
    
    // Calculate next notification within waking hours
    const timeSinceWake = now.getTime() - startTime.getTime();
    const intervalsPassed = Math.floor(timeSinceWake / (intervalMinutes * 60 * 1000));
    const nextNotification = new Date(startTime.getTime() + (intervalsPassed + 1) * intervalMinutes * 60 * 1000);
    
    // If next notification is after sleep time, it's tomorrow at wake time
    if (nextNotification >= endTime) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), wakeHour, wakeMinute);
    }
    
    return nextNotification;
};


export default {
    initializeReminders,
    scheduleAlarms,
    scheduleDailyTipNotification,
    getNextNotificationTimes
};