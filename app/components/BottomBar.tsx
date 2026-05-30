import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from './AppContext';

interface Props {
  onShare: () => void;
}

export function BottomBar({ onShare }: Props) {
  const router = useRouter();
  const { isPaid, purchaseFullVersion } = useApp();

  const handleTips = async () => {
    if (!isPaid) {
      await purchaseFullVersion();
      return;
    }
    router.push('/tips');
  };

  return (
    <View style={styles.bar}>
      {/* Slideshow icon (left) */}
      <TouchableOpacity style={styles.item} onPress={() => router.push('/slideshow-options')}>
        <Text style={styles.icon}>🎠</Text>
      </TouchableOpacity>

      {/* News text button */}
      <TouchableOpacity style={styles.item} onPress={() => router.push('/news')}>
        <Text style={styles.label}>News</Text>
      </TouchableOpacity>

      {/* Weather icon (center) */}
      <TouchableOpacity style={styles.item} onPress={() => router.push('/weather')}>
        <Text style={styles.icon}>⛅</Text>
      </TouchableOpacity>

      {/* Tips — paid only, shown after purchase */}
      {isPaid ? (
        <TouchableOpacity style={styles.item} onPress={handleTips}>
          <Text style={styles.label}>Tips</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.item} onPress={handleTips}>
          <Text style={[styles.label, styles.locked]}>Tips 🔒</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 28,
  },
  item: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  locked: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
});
