import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';

const NUM_DOTS = 8;
const RADIUS = 25;
const DOT_SIZE = 8;
const BLUE = '#0A3D62';

const CircleCollapseLoader = () => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const dots = Array.from({ length: NUM_DOTS }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / NUM_DOTS;
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x * RADIUS, 0],
    });

    const translateY = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [y * RADIUS, 0],
    });

    return (
      <Animated.View
        key={i}
        style={[
          styles.dot,
          {
            transform: [{ translateX }, { translateY }],
          },
        ]}
      />
    );
  });

  return <View style={styles.container}>{dots}</View>;
};

export default CircleCollapseLoader;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: BLUE,
  },
});