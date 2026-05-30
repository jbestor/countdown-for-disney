import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './components/AppContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#0d1b2a' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="weather" options={{ title: 'WDW Weather' }} />
          <Stack.Screen name="news" options={{ title: 'Disney News' }} />
          <Stack.Screen name="tips" options={{ title: 'Disney Tips' }} />
          <Stack.Screen name="set-date" options={{ title: 'Set Trip Date' }} />
          <Stack.Screen name="background" options={{ title: 'Background Photo' }} />
          <Stack.Screen name="slideshow-options" options={{ title: 'Slideshow Options' }} />
          <Stack.Screen name="customize-widget" options={{ title: 'Customize Widget' }} />
          <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="about" options={{ title: 'About' }} />
        </Stack>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
