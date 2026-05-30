import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';

interface Props {
  days: number;
}

// Draggable wand/star widget — mirrors the draggable wand in the original iOS app
export function WandWidget({ days }: Props) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  return (
    <Animated.View
      style={[styles.wand, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.star}>✨</Text>
      <View style={styles.bubble}>
        <Text style={styles.bubbleDays}>{days}</Text>
        <Text style={styles.bubbleLabel}>days</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wand: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  star: {
    fontSize: 32,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  },
  bubbleDays: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  bubbleLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
});
