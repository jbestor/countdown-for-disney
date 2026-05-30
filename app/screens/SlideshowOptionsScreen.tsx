import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../components/AppContext';

const INTERVALS = [3, 5, 10, 15, 30];

export default function SlideshowOptionsScreen() {
  const router = useRouter();
  const { slideshowEnabled, slideshowInterval, setSlideshowEnabled, setSlideshowInterval } = useApp();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slideshow Options</Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.rowLabel}>Enable Slideshow</Text>
          <Text style={styles.rowSub}>Cycle through Disney backgrounds</Text>
        </View>
        <Switch
          value={slideshowEnabled}
          onValueChange={setSlideshowEnabled}
          trackColor={{ true: '#1a73e8' }}
        />
      </View>

      <Text style={styles.sectionLabel}>Change Photo Every</Text>
      <View style={styles.intervalGrid}>
        {INTERVALS.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.intervalBtn, slideshowInterval === s && styles.intervalBtnActive]}
            onPress={() => setSlideshowInterval(s)}
          >
            <Text style={[styles.intervalText, slideshowInterval === s && styles.intervalTextActive]}>
              {s}s
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
        <Text style={styles.doneBtnText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a', padding: 24, paddingTop: 80 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 32 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  rowLabel: { color: '#fff', fontSize: 16, fontWeight: '500' },
  rowSub: { color: '#888', fontSize: 13, marginTop: 2 },
  sectionLabel: { color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  intervalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  intervalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  intervalBtnActive: { backgroundColor: '#1a73e8' },
  intervalText: { color: '#aaa', fontWeight: '600' },
  intervalTextActive: { color: '#fff' },
  doneBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  doneBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
