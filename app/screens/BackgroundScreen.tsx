import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useApp } from '../components/AppContext';
import { BACKGROUNDS } from '../assets/backgrounds';

export default function BackgroundScreen() {
  const router = useRouter();
  const { backgroundIndex, backgroundUri, setBackgroundIndex, setBackgroundUri } = useApp();

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access to use your own photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await setBackgroundUri(result.assets[0].uri);
      router.back();
    }
  };

  const handleSelectBackground = async (index: number) => {
    await setBackgroundIndex(index);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Background Photo</Text>

      {/* User photo option */}
      <TouchableOpacity style={styles.photoBtn} onPress={handlePickPhoto}>
        <Text style={styles.photoBtnIcon}>📷</Text>
        <Text style={styles.photoBtnText}>Choose from Library</Text>
        {backgroundUri && <Text style={styles.selectedBadge}>✓ Selected</Text>}
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Disney Backgrounds</Text>

      <FlatList
        data={BACKGROUNDS}
        numColumns={3}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.bgThumb,
              !backgroundUri && backgroundIndex === item.id && styles.bgThumbSelected,
            ]}
            onPress={() => handleSelectBackground(item.id)}
          >
            <Image source={item.source} style={styles.thumbImage} resizeMode="cover" />
            <Text style={styles.thumbLabel} numberOfLines={1}>{item.label}</Text>
            {!backgroundUri && backgroundIndex === item.id && (
              <View style={styles.checkOverlay}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', padding: 16, paddingTop: 60 },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    gap: 12,
  },
  photoBtnIcon: { fontSize: 24 },
  photoBtnText: { color: '#fff', fontSize: 16, fontWeight: '500', flex: 1 },
  selectedBadge: { color: '#4CAF50', fontWeight: '600' },
  sectionLabel: { color: '#888', fontSize: 13, paddingHorizontal: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  grid: { paddingHorizontal: 8, paddingBottom: 40 },
  bgThumb: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  bgThumbSelected: {
    borderWidth: 2,
    borderColor: '#1a73e8',
  },
  thumbImage: { width: '100%', aspectRatio: 9 / 16, height: undefined },
  thumbLabel: { color: '#aaa', fontSize: 10, textAlign: 'center', padding: 4 },
  checkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,115,232,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: { color: '#fff', fontSize: 32, fontWeight: '700' },
});
