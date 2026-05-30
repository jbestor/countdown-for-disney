import { StorageService } from './StorageService';
import { remoteConfigService } from './RemoteConfigService';
import bundledNotifications from '../data/notifications.json';

export interface NotificationMilestone {
  name: string;
  day: number;
  content: string;
}

async function loadMilestones(): Promise<NotificationMilestone[]> {
  const data = (await remoteConfigService.get('notifications.json', bundledNotifications)) as any;
  return data?.notifications ?? bundledNotifications.notifications;
}

// Lazy-load expo-notifications so it never runs at module initialization time.
// expo-notifications is not fully supported in Expo Go and will crash if called
// during the module graph initialization phase.
async function getNotifications() {
  return import('expo-notifications');
}

export async function requestPermissions(): Promise<boolean> {
  try {
    const Notifications = await getNotifications();
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleCountdownNotifications(tripDate: Date): Promise<void> {
  try {
    const enabled = await StorageService.getNotificationsEnabled();
    if (!enabled) return;

    await cancelAllCountdownNotifications();

    const granted = await requestPermissions();
    if (!granted) return;

    const Notifications = await getNotifications();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

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
        trigger: { date: triggerDate } as any,
      });
      scheduledIds.push(id);
    }

    await StorageService.setScheduledNotifications(scheduledIds);
  } catch {
    // Notifications are best-effort; never crash the app over them
  }
}

export async function cancelAllCountdownNotifications(): Promise<void> {
  try {
    const ids = await StorageService.getScheduledNotifications();
    if (ids.length === 0) return;
    const Notifications = await getNotifications();
    for (const id of ids) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    await StorageService.setScheduledNotifications([]);
  } catch {
    // silent
  }
}
