import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type AppFABProps = {
  onPress: () => void;
  icon?: string;
  label?: string;
  style?: object;
};

const AppFAB: React.FC<AppFABProps> = ({ onPress, icon = 'plus', label, style }) => {
  return (
    <FAB
      icon={({ size, color }) => (
        <MaterialCommunityIcons name={icon} size={size} color={color} />
      )}
      label={label}
      onPress={onPress}
      style={[styles.fab, style]}
      color="#000"
      rippleColor="rgba(0, 0, 0, 0.1)"
    />
  );
};

export default AppFAB;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
