import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StorageService } from '../services/StorageService';
import {
  scheduleCountdownNotifications,
  cancelAllCountdownNotifications,
  requestPermissions,
} from '../services/NotificationService';
import { useApp } from '../components/AppContext';
import bundledNotifications from '../data/notifications.json';

export default function NotificationsScreen() {
  const router = useRouter();
  const { tripDate } = useApp();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    StorageService.getNotificationsEnabled().then(setEnabled);
  }, []);

  const handleToggle = async (value: boolean) => {
    setEnabled(value);
    await StorageService.setNotificationsEnabled(value);
    if (value && tripDate) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert('Permission Required', 'Enable notifications in Settings to receive countdown reminders.');
        setEnabled(false);
        await StorageService.setNotificationsEnabled(false);
        return;
      }
      await scheduleCountdownNotifications(tripDate);
    } else {
      await cancelAllCountdownNotifications();
    }
  };

  const milestones = bundledNotifications.notifications;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Get reminders as your trip approaches</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Enable Reminders</Text>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ true: '#1a73e8' }}
        />
      </View>

      {!tripDate && (
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>⚠️ Set your trip date first to enable notifications.</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Milestones</Text>
      {milestones.map((m, i) => (
        <View key={i} style={styles.milestoneRow}>
          <Text style={styles.milestoneDays}>{m.day}d</Text>
          <Text style={styles.milestoneText}>{m.content}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
        <Text style={styles.doneBtnText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a' },
  content: { padding: 24, paddingTop: 80, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 24 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  toggleLabel: { color: '#fff', fontSize: 16, fontWeight: '500' },
  warningCard: {
    backgroundColor: 'rgba(255,200,0,0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  warningText: { color: '#ffcc00', fontSize: 13 },
  sectionLabel: { color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  milestoneDays: { color: '#1a73e8', fontWeight: '700', width: 36, fontSize: 13 },
  milestoneText: { color: '#ccc', fontSize: 13, lineHeight: 18, flex: 1 },
  doneBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  doneBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
