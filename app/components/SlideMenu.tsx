import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Linking,
  Alert, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from './AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  paid?: boolean;
  onPress: () => void;
}

export function SlideMenu({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { isPaid, purchaseFullVersion, restorePurchases } = useApp();

  const navigate = (route: string, requiresPaid = false) => async () => {
    if (requiresPaid && !isPaid) {
      const success = await purchaseFullVersion();
      if (!success) return;
    }
    onClose();
    router.push(route as any);
  };

  const menuItems: MenuItem[] = [
    { label: 'Set Trip Date', onPress: navigate('/set-date') },
    { label: 'Background Photo', onPress: navigate('/background') },
    { label: 'Slideshow Options', onPress: navigate('/slideshow-options') },
    { label: 'Customize Widget 🔒', paid: true, onPress: navigate('/customize-widget', true) },
    { label: 'Notifications 🔒', paid: true, onPress: navigate('/notifications', true) },
    { label: 'Hide Menu 🔒', paid: true, onPress: navigate('/hide-menu', true) },
  ];

  const handleShare = async () => {
    onClose();
    router.push('/share' as any);
  };

  const handleMSW = () => {
    Linking.openURL('https://www.mainstreetwishes.com').catch(() => {});
    onClose();
  };

  const handleInfo = () => {
    onClose();
    router.push('/about' as any);
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    Alert.alert(
      success ? 'Restored!' : 'Nothing to Restore',
      success ? 'Full version has been unlocked.' : 'No previous purchase found.',
    );
  };

  return (
    <View style={styles.menu}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.menuTitle}>Countdown for Disney</Text>

        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.menuItem, item.paid && !isPaid && styles.menuItemLocked]}
            onPress={item.onPress}
          >
            <Text style={[styles.menuLabel, item.paid && !isPaid && styles.menuLabelLocked]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
          <Text style={styles.menuLabel}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleMSW}>
          <Text style={styles.menuLabel}>Main Street Wishes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleInfo}>
          <Text style={styles.menuLabel}>Info / About</Text>
        </TouchableOpacity>

        {!isPaid && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.purchaseBtn} onPress={purchaseFullVersion}>
              <Text style={styles.purchaseBtnText}>Unlock Full Version — $0.99</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
              <Text style={styles.restoreText}>Restore Purchase</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '78%',
    backgroundColor: '#1a1a2e',
    zIndex: 5,
  },
  scroll: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  menuItemLocked: {
    opacity: 0.5,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 16,
  },
  menuLabelLocked: {
    color: '#aaa',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 8,
    marginHorizontal: 20,
  },
  purchaseBtn: {
    margin: 16,
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  purchaseBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  restoreBtn: {
    marginHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  restoreText: {
    color: '#888',
    fontSize: 13,
  },
});
