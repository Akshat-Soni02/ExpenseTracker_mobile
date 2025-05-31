import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  PanResponder,
  Animated as RNAnimated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CenterActionButton() {
  const [showActions, setShowActions] = useState(false);
  const [mode, setMode] = useState<'tap' | 'longPress' | null>(null);
  const scale = useRef(new RNAnimated.Value(0)).current;
  const touchStartTime = useRef<number | null>(null);

  const openActions = (newMode: 'tap' | 'longPress') => {
    setMode(newMode);
    setShowActions(true);
    RNAnimated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeActions = () => {
    setMode(null);
    RNAnimated.spring(scale, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setShowActions(false));
  };

  const toggleTap = () => {
    if (showActions && mode === 'tap') {
      closeActions();
    } else {
      openActions('tap');
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        touchStartTime.current = Date.now();
      },
      onPanResponderMove: (_, gesture) => {
        if (mode === 'longPress') {
          const { dx, dy } = gesture;
          if (dy < -30) {
            if (dx < -40) {
              console.log('Swiped left (Button 1)');
              closeActions();
            } else if (dx > 40) {
              console.log('Swiped right (Button 2)');
              closeActions();
            }
          }
        }
      },
      onPanResponderRelease: () => {
        const duration = Date.now() - (touchStartTime.current ?? 0);
        touchStartTime.current = null;

        if (duration > 300) {
          if (!showActions || mode !== 'longPress') {
            openActions('longPress');
          } else {
            closeActions();
          }
        } else {
          toggleTap(); // Treat as tap
        }
      },
    })
  ).current;

  return (
    <>
      {showActions && (
        <>
          <RNAnimated.View
            style={[
              styles.action,
              {
                bottom: 90,
                left: '30%',
                transform: [{ scale }],
              },
            ]}
          >
            <Pressable onPress={() => console.log('Tapped Button 1')}>
              <MaterialCommunityIcons name="plus-box" size={30} color="white" />
            </Pressable>
          </RNAnimated.View>
          <RNAnimated.View
            style={[
              styles.action,
              {
                bottom: 90,
                right: '30%',
                transform: [{ scale }],
              },
            ]}
          >
            <Pressable onPress={() => console.log('Tapped Button 2')}>
              <MaterialCommunityIcons name="calendar" size={30} color="white" />
            </Pressable>
          </RNAnimated.View>
        </>
      )}

      {/* Main button with pan handlers attached directly */}
      <Pressable style={styles.centerWrapper} {...panResponder.panHandlers}>
        <View style={styles.centerButton}>
          <MaterialCommunityIcons name="plus" size={30} color="white" />
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    position: 'absolute',
    bottom: 20,
    left: '42.5%',
    zIndex: 10,
  },
  centerButton: {
    backgroundColor: '#3A5AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  action: {
    position: 'absolute',
    backgroundColor: '#3A5AFF',
    padding: 12,
    borderRadius: 25,
    elevation: 5,
    zIndex: 9,
  },
});