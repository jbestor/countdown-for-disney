import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../components/AppContext';

const WIDGET_STYLES = [
  { id: 'default', label: 'Classic', description: 'Days remaining with castle background' },
  { id: 'minimal', label: 'Minimal', description: 'Just the number — clean and simple' },
  { id: 'photo', label: 'With Photo', description: 'Uses your selected background photo' },
];

export default function CustomizeWidgetScreen() {
  const router = useRouter();
  const { setWidgetStyle } = useApp() as any;
  const [selected, setSelected] = React.useState('default');

  const handleSave = async () => {
    if (setWidgetStyle) await setWidgetStyle(selected);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customize Widget</Text>
      <Text style={styles.subtitle}>Choose your home screen widget style</Text>

      {WIDGET_STYLES.map(style => (
        <TouchableOpacity
          key={style.id}
          style={[styles.option, selected === style.id && styles.optionSelected]}
          onPress={() => setSelected(style.id)}
        >
          <View>
            <Text style={styles.optionLabel}>{style.label}</Text>
            <Text style={styles.optionDesc}>{style.description}</Text>
          </View>
          {selected === style.id && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      ))}

      <Text style={styles.note}>
        After saving, long-press your home screen to add the Countdown for Disney widget.
      </Text>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a', padding: 24, paddingTop: 80 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 24 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionSelected: { backgroundColor: 'rgba(26,115,232,0.2)', borderWidth: 1, borderColor: '#1a73e8' },
  optionLabel: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  optionDesc: { color: '#888', fontSize: 13 },
  check: { color: '#1a73e8', fontSize: 20, fontWeight: '700' },
  note: { color: '#666', fontSize: 12, lineHeight: 17, marginTop: 8, marginBottom: 32 },
  saveBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
