import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TRIP_DATE: 'tripDate',
  BACKGROUND_INDEX: 'backgroundIndex',
  BACKGROUND_URI: 'backgroundUri',
  IS_PAID: 'isPaid',
  SLIDESHOW_INTERVAL: 'slideshowInterval',
  SLIDESHOW_ENABLED: 'slideshowEnabled',
  WIDGET_STYLE: 'widgetStyle',
  HIDE_MENU: 'hideMenu',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  SCHEDULED_NOTIFICATIONS: 'scheduledNotifications',
} as const;

export const StorageService = {
  async getTripDate(): Promise<Date | null> {
    const val = await AsyncStorage.getItem(KEYS.TRIP_DATE);
    return val ? new Date(val) : null;
  },
  async setTripDate(date: Date): Promise<void> {
    await AsyncStorage.setItem(KEYS.TRIP_DATE, date.toISOString());
  },

  async getBackgroundIndex(): Promise<number> {
    const val = await AsyncStorage.getItem(KEYS.BACKGROUND_INDEX);
    return val !== null ? parseInt(val, 10) : 0;
  },
  async setBackgroundIndex(index: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.BACKGROUND_INDEX, String(index));
  },

  async getBackgroundUri(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.BACKGROUND_URI);
  },
  async setBackgroundUri(uri: string | null): Promise<void> {
    if (uri) await AsyncStorage.setItem(KEYS.BACKGROUND_URI, uri);
    else await AsyncStorage.removeItem(KEYS.BACKGROUND_URI);
  },

  async getIsPaid(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.IS_PAID);
    return val === 'true';
  },
  async setIsPaid(paid: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.IS_PAID, paid ? 'true' : 'false');
  },

  async getSlideshowInterval(): Promise<number> {
    const val = await AsyncStorage.getItem(KEYS.SLIDESHOW_INTERVAL);
    return val !== null ? parseInt(val, 10) : 5;
  },
  async setSlideshowInterval(seconds: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.SLIDESHOW_INTERVAL, String(seconds));
  },

  async getSlideshowEnabled(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.SLIDESHOW_ENABLED);
    return val !== 'false';
  },
  async setSlideshowEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.SLIDESHOW_ENABLED, enabled ? 'true' : 'false');
  },

  async getWidgetStyle(): Promise<string> {
    const val = await AsyncStorage.getItem(KEYS.WIDGET_STYLE);
    return val ?? 'default';
  },
  async setWidgetStyle(style: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.WIDGET_STYLE, style);
  },

  async getHideMenu(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.HIDE_MENU);
    return val === 'true';
  },
  async setHideMenu(hide: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.HIDE_MENU, hide ? 'true' : 'false');
  },

  async getNotificationsEnabled(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.NOTIFICATIONS_ENABLED);
    return val !== 'false';
  },
  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS_ENABLED, enabled ? 'true' : 'false');
  },

  async getScheduledNotifications(): Promise<string[]> {
    const val = await AsyncStorage.getItem(KEYS.SCHEDULED_NOTIFICATIONS);
    return val ? JSON.parse(val) : [];
  },
  async setScheduledNotifications(ids: string[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.SCHEDULED_NOTIFICATIONS, JSON.stringify(ids));
  },
};
