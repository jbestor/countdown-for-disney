import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://countdownfordisney.com/config/';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export type RemoteEndpoint = 'notifications.json' | 'tips.json' | 'news.json';

interface CacheEntry {
  data: unknown;
  fetchedAt: number;
}

class RemoteConfigService {
  private async fetchRemote(endpoint: RemoteEndpoint): Promise<unknown | null> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return null;
      const json = await response.json();
      return json;
    } catch {
      return null;
    }
  }

  private async loadCache(endpoint: RemoteEndpoint): Promise<unknown | null> {
    try {
      const raw = await AsyncStorage.getItem(`remoteConfig:${endpoint}`);
      if (!raw) return null;
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
      return entry.data;
    } catch {
      return null;
    }
  }

  private async saveCache(endpoint: RemoteEndpoint, data: unknown): Promise<void> {
    try {
      const entry: CacheEntry = { data, fetchedAt: Date.now() };
      await AsyncStorage.setItem(`remoteConfig:${endpoint}`, JSON.stringify(entry));
    } catch {
      // cache write failure is non-fatal
    }
  }

  async get(endpoint: RemoteEndpoint, bundleFallback: unknown): Promise<unknown> {
    const remote = await this.fetchRemote(endpoint);
    if (remote !== null) {
      await this.saveCache(endpoint, remote);
      return remote;
    }
    const cached = await this.loadCache(endpoint);
    if (cached !== null) return cached;
    return bundleFallback;
  }
}

export const remoteConfigService = new RemoteConfigService();
