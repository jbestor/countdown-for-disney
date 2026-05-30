import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Countdown for Disney</Text>
      <Text style={styles.version}>Version 1.0.0</Text>

      <View style={styles.card}>
        <Text style={styles.disclaimer}>
          This app is not affiliated with, endorsed by, or sponsored by The Walt Disney Company or any of its subsidiaries or affiliates. "Disney," "Walt Disney World," and related marks are trademarks of The Walt Disney Company.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About the App</Text>
        <Text style={styles.cardText}>
          Countdown for Disney helps you track the days until your Walt Disney World vacation, with Disney-inspired backgrounds, trip planning reminders, weather forecasts for the parks, and tips from MainStreetWishes.com.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.linkRow}
        onPress={() => Linking.openURL('https://www.mainstreetwishes.com').catch(() => {})}
      >
        <Text style={styles.linkText}>MainStreetWishes.com</Text>
        <Text style={styles.linkArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkRow}
        onPress={() => Linking.openURL('mailto:jason@bit3computing.com').catch(() => {})}
      >
        <Text style={styles.linkText}>Contact Support</Text>
        <Text style={styles.linkArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkRow}
        onPress={() => Linking.openURL('https://www.facebook.com/groups/countdowntodisneyapp/').catch(() => {})}
      >
        <Text style={styles.linkText}>Facebook Community</Text>
        <Text style={styles.linkArrow}>→</Text>
      </TouchableOpacity>

      <Text style={styles.copyright}>© {new Date().getFullYear()} Bit3 Computing</Text>

      <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
        <Text style={styles.doneBtnText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a' },
  content: { padding: 24, paddingTop: 80, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 4 },
  version: { color: '#888', fontSize: 14, marginBottom: 24 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { color: '#fff', fontWeight: '600', marginBottom: 8 },
  cardText: { color: '#bbb', fontSize: 14, lineHeight: 20 },
  disclaimer: {
    color: '#aaa',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  linkText: { color: '#1a73e8', fontSize: 16 },
  linkArrow: { color: '#555', fontSize: 16 },
  copyright: { color: '#555', fontSize: 12, textAlign: 'center', marginTop: 24, marginBottom: 16 },
  doneBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontWeight: '600' },
});
