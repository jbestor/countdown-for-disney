import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Linking,
} from 'react-native';
import { remoteConfigService } from '../services/RemoteConfigService';
import bundledNews from '../data/news.json';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  url: string;
}

interface NewsData {
  version: number;
  news: NewsItem[];
  feedUrl: string;
}

export default function NewsScreen() {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = (await remoteConfigService.get('news.json', bundledNews)) as NewsData;
      setData(result);
      setLoading(false);
    })();
  }, []);

  const openArticle = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  const items = data?.news ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disney News</Text>
      <Text style={styles.subheader}>from MainStreetWishes.com</Text>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No news available. Check back soon!</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openArticle(item.url)}>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.summary} numberOfLines={3}>{item.summary}</Text>
            <Text style={styles.readMore}>Read more →</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.mswBtn}
        onPress={() => Linking.openURL('https://www.mainstreetwishes.com').catch(() => {})}
      >
        <Text style={styles.mswBtnText}>Visit MainStreetWishes.com</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d1b2a' },
  header: { color: '#fff', fontSize: 24, fontWeight: '700', paddingHorizontal: 16, paddingTop: 60 },
  subheader: { color: '#888', fontSize: 13, paddingHorizontal: 16, marginBottom: 16 },
  list: { padding: 16, paddingBottom: 80 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 40 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  date: { color: '#888', fontSize: 12, marginBottom: 4 },
  title: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  summary: { color: '#bbb', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  readMore: { color: '#1a73e8', fontSize: 13, fontWeight: '500' },
  mswBtn: {
    margin: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  mswBtnText: { color: '#fff', fontWeight: '600' },
});
