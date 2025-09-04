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

    if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
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
            sound: "alarm.wav"
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
        waterIntervalMinutes = Math.round((wakingHours / DEFAULT_WATER_REMINDERS_PER_DAY) * 60);
    }

    if (waterIntervalMinutes > 0) {
        await scheduleAlarms(
            wakeHour, wakeMinute, 
            sleepHour, sleepMinute, 
            waterIntervalMinutes, 
            "Il est temps de s'hydrater !", 
            WATER_REMINDER_ID_OFFSET
        );
    }

    // --- Move Reminders ---
    const moveIntervalMinutes = profile.moveReminderFrequency || 60; // Manual override or default to 60 minutes
    await scheduleAlarms(
        wakeHour, wakeMinute, 
        sleepHour, sleepMinute, 
        moveIntervalMinutes, 
        "Un petit mouvement s'impose !", 
        MOVE_REMINDER_ID_OFFSET
    );
};

export default {
    initializeReminders,
    scheduleAlarms,
    scheduleDailyTipNotification
};