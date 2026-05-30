import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableWithoutFeedback,
  Animated, PanResponder, Dimensions, Platform, Share,
} from 'react-native';
import { useApp } from '../components/AppContext';
import { BottomBar } from '../components/BottomBar';
import { SlideMenu } from '../components/SlideMenu';
import { WandWidget } from '../components/WandWidget';
import { BACKGROUNDS } from '../assets/backgrounds';
import { computeCountdown } from '../utils/countdown';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;

export default function MainScreen() {
  const {
    tripDate, backgroundIndex, backgroundUri,
    isPaid, slideshowEnabled, slideshowInterval,
    isMenuOpen, setIsMenuOpen, hideMenu,
  } = useApp();

  const [countdown, setCountdown] = useState(computeCountdown(tripDate));
  const [currentBgIndex, setCurrentBgIndex] = useState(backgroundIndex);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCurrentBgIndex(backgroundIndex);
  }, [backgroundIndex]);

  useEffect(() => {
    const tick = () => setCountdown(computeCountdown(tripDate));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [tripDate]);

  useEffect(() => {
    if (slideshowEnabled && !backgroundUri) {
      slideshowRef.current = setInterval(() => {
        setCurrentBgIndex(i => (i + 1) % BACKGROUNDS.length);
      }, slideshowInterval * 1000);
    }
    return () => {
      if (slideshowRef.current) clearInterval(slideshowRef.current);
    };
  }, [slideshowEnabled, slideshowInterval, backgroundUri]);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH * 0.78,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, setIsMenuOpen]);

  const closeMenu = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setIsMenuOpen(false));
  }, [slideAnim, setIsMenuOpen]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderRelease: (_, g) => {
      if (g.dx > SWIPE_THRESHOLD && !isMenuOpen) openMenu();
      if (g.dx < -SWIPE_THRESHOLD && isMenuOpen) closeMenu();
    },
  });

  const backgroundSource = backgroundUri
    ? { uri: backgroundUri }
    : BACKGROUNDS[currentBgIndex]?.source ?? BACKGROUNDS[0].source;

  const handleShare = async () => {
    try {
      await Share.share({
        message: tripDate
          ? `${countdown.days} days until my Disney vacation! 🏰 Counted down with Countdown for Disney.`
          : "I'm counting down to Disney! 🏰 Countdown for Disney app.",
      });
    } catch {
      // user dismissed
    }
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover">
        {/* Dim overlay */}
        <View style={styles.overlay} />

        {/* Animated content panel (shifts right when menu opens) */}
        <Animated.View style={[styles.contentPanel, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.countdownContainer}>
            <Text style={styles.daysNumber}>{countdown.days}</Text>
            <Text style={styles.daysLabel}>DAYS</Text>
            {tripDate ? (
              <Text style={styles.untilText}>
                until your Disney vacation!
              </Text>
            ) : (
              <Text style={styles.untilText}>Set your trip date to start counting!</Text>
            )}
            {tripDate && (
              <Text style={styles.dateText}>
                {tripDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            )}
          </View>

          <WandWidget days={countdown.days} />

          <BottomBar onShare={handleShare} />
        </Animated.View>

        {/* Slide-out menu sits behind the content panel */}
        {!hideMenu && (
          <SlideMenu isOpen={isMenuOpen} onClose={closeMenu} />
        )}

        {/* Tap outside menu to close */}
        {isMenuOpen && (
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.menuDismiss} />
          </TouchableWithoutFeedback>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  contentPanel: {
    flex: 1,
    justifyContent: 'space-between',
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  daysNumber: {
    fontSize: 120,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  daysLabel: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 6,
    marginTop: -12,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  untilText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
  },
  menuDismiss: {
    ...StyleSheet.absoluteFillObject,
  },
});
