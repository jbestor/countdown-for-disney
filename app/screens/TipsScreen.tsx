import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { remoteConfigService } from '../services/RemoteConfigService';
import bundledTips from '../data/tips.json';

interface TipsData {
  version: number;
  categories: Array<{
    title: string;
    icon: string;
    tips: string[];
  }>;
}

export default function TipsScreen() {
  const [data, setData] = useState<TipsData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = (await remoteConfigService.get('tips.json', bundledTips)) as TipsData;
      setData(result);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  const categories = data?.categories ?? [];
  const currentTips = categories[selectedCategory]?.tips ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disney Tips</Text>

      {/* Category pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.categoryPill, i === selectedCategory && styles.categoryPillActive]}
            onPress={() => setSelectedCategory(i)}
          >
            <Text style={[styles.categoryText, i === selectedCategory && styles.categoryTextActive]}>
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tips list */}
      <FlatList
        data={currentTips}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.tipsList}
        renderItem={({ item, index }) => (
          <View style={styles.tipCard}>
            <Text style={styles.tipNumber}>{index + 1}</Text>
            <Text style={styles.tipText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d1b2a' },
  header: { color: '#fff', fontSize: 24, fontWeight: '700', padding: 16, paddingTop: 60 },
  categoryScroll: { paddingHorizontal: 12, marginBottom: 8, flexGrow: 0 },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryPillActive: { backgroundColor: '#1a73e8' },
  categoryText: { color: '#aaa', fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  tipsList: { padding: 16 },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  tipNumber: {
    color: '#1a73e8',
    fontWeight: '700',
    fontSize: 16,
    width: 28,
    marginTop: 1,
  },
  tipText: { color: '#ddd', fontSize: 14, lineHeight: 20, flex: 1 },
});
