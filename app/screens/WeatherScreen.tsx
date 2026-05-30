import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  Image, RefreshControl, TouchableOpacity,
} from 'react-native';
import { fetchWDWWeather, getWeatherIconUrl, WeatherData } from '../services/WeatherService';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setError(null);
      const data = await fetchWDWWeather();
      setWeather(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load weather');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const dayName = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short' });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.loadingText}>Loading Walt Disney World weather...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.location}>Walt Disney World</Text>
      <Text style={styles.locationSub}>Orlando, Florida</Text>

      {weather && (
        <>
          {/* Current conditions */}
          <View style={styles.currentCard}>
            <Image
              source={{ uri: getWeatherIconUrl(weather.current.icon) }}
              style={styles.currentIcon}
            />
            <Text style={styles.currentTemp}>{weather.current.temp}°F</Text>
            <Text style={styles.currentDesc}>{weather.current.description}</Text>
            <View style={styles.currentDetails}>
              <Text style={styles.detailText}>Feels like {weather.current.feelsLike}°F</Text>
              <Text style={styles.detailText}>Humidity {weather.current.humidity}%</Text>
              <Text style={styles.detailText}>Wind {weather.current.windSpeed} mph</Text>
            </View>
          </View>

          {/* 7-day forecast */}
          <Text style={styles.forecastTitle}>7-Day Forecast</Text>
          {weather.daily.map((day, i) => (
            <View key={i} style={styles.dayRow}>
              <Text style={styles.dayName}>{i === 0 ? 'Today' : dayName(day.date)}</Text>
              <Image source={{ uri: getWeatherIconUrl(day.icon) }} style={styles.dayIcon} />
              <Text style={styles.dayDesc}>{day.description}</Text>
              <View style={styles.tempRange}>
                <Text style={styles.tempHigh}>{day.high}°</Text>
                <Text style={styles.tempLow}>{day.low}°</Text>
              </View>
            </View>
          ))}

          <Text style={styles.attribution}>Powered by OpenWeatherMap</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1b2a' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d1b2a', padding: 24 },
  loadingText: { color: '#aaa', marginTop: 12 },
  errorText: { color: '#ff6b6b', textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: '#1a73e8', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  location: { color: '#fff', fontSize: 26, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  locationSub: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  currentCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  currentIcon: { width: 80, height: 80 },
  currentTemp: { color: '#fff', fontSize: 56, fontWeight: '300', marginTop: -8 },
  currentDesc: { color: '#ddd', fontSize: 16, marginTop: 4, textTransform: 'capitalize' },
  currentDetails: { flexDirection: 'row', gap: 16, marginTop: 12 },
  detailText: { color: '#aaa', fontSize: 13 },
  forecastTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  dayName: { color: '#fff', width: 52, fontWeight: '600' },
  dayIcon: { width: 36, height: 36 },
  dayDesc: { color: '#bbb', flex: 1, marginLeft: 8, fontSize: 13, textTransform: 'capitalize' },
  tempRange: { flexDirection: 'row', gap: 8 },
  tempHigh: { color: '#fff', fontWeight: '600', width: 32, textAlign: 'right' },
  tempLow: { color: '#888', width: 32, textAlign: 'right' },
  attribution: { color: '#555', fontSize: 11, textAlign: 'center', marginTop: 20 },
});
