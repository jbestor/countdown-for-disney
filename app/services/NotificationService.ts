import * as Notifications from 'expo-notifications';
import { StorageService } from './StorageService';
import { remoteConfigService } from './RemoteConfigService';
import bundledNotifications from '../data/notifications.json';

export interface NotificationMilestone {
  name: string;
  day: number;
  content: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function loadMilestones(): Promise<NotificationMilestone[]> {
  const data = (await remoteConfigService.get('notifications.json', bundledNotifications)) as any;
  return data?.notifications ?? bundledNotifications.notifications;
}

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleCountdownNotifications(tripDate: Date): Promise<void> {
  const enabled = await StorageService.getNotificationsEnabled();
  if (!enabled) return;

  await cancelAllCountdownNotifications();

  const granted = await requestPermissions();
  if (!granted) return;

  const milestones = await loadMilestones();
  const scheduledIds: string[] = [];

  for (const milestone of milestones) {
    const triggerDate = new Date(tripDate);
    triggerDate.setDate(triggerDate.getDate() - milestone.day);
    triggerDate.setHours(9, 0, 0, 0);

    if (triggerDate <= new Date()) continue;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Countdown for Disney',
        body: milestone.content,
        data: { name: milestone.name },
      },
      trigger: { date: triggerDate },
    });
    scheduledIds.push(id);
  }

  await StorageService.setScheduledNotifications(scheduledIds);
}

export async function cancelAllCountdownNotifications(): Promise<void> {
  const ids = await StorageService.getScheduledNotifications();
  for (const id of ids) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
  await StorageService.setScheduledNotifications([]);
}
