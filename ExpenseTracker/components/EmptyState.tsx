import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type EmptyStateProps = {
  title: string;
  subtitle: string;
  iconName?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  iconName = 'folder-outline',
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={iconName} size={48} color="#B0BEC5" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
    marginTop: 4,
  },
});