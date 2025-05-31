import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  current: number;
  total: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  height = 14,
  color = "#5B61F5",
  backgroundColor = '#D9DFFB',
  showLabel = true,
}) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  const percentage = Math.min((current / total) * 100, 100);

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>
            {current} / {total}
          </Text>
          <Text style={styles.labelText}>{Math.round(percentage)}%</Text>
        </View>
      )}
      <View style={[styles.progressBackground, { height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.progressBar,
            { height, backgroundColor: color, width: animatedWidth },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 13,
    color: '#1E1E2F',
    fontWeight: '500',
  },
  progressBackground: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 999,
  },
});

export default ProgressBar;