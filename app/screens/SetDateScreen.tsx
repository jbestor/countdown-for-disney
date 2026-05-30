import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useApp } from '../components/AppContext';

export default function SetDateScreen() {
  const router = useRouter();
  const { tripDate, setTripDate } = useApp();
  const [date, setDate] = useState(tripDate ?? new Date());
  const [show, setShow] = useState(Platform.OS === 'ios');

  const handleSave = async () => {
    await setTripDate(date);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Trip Date</Text>
      <Text style={styles.subtitle}>When does the magic begin?</Text>

      {Platform.OS === 'android' && (
        <TouchableOpacity style={styles.pickBtn} onPress={() => setShow(true)}>
          <Text style={styles.pickBtnText}>
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
      )}

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={(_, selected) => {
            if (Platform.OS === 'android') setShow(false);
            if (selected) setDate(selected);
          }}
          style={styles.picker}
          textColor="#fff"
        />
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Date</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a', padding: 24, paddingTop: 80 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#aaa', fontSize: 16, marginBottom: 32 },
  picker: { marginBottom: 32 },
  pickBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 32,
  },
  pickBtnText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  saveBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
