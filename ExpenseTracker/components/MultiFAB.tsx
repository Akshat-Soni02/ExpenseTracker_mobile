import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppFAB from './AppFab';

export type FABAction = {
  icon: string;
  label: string;
  onPress: () => void;
};

type MultiFABProps = {
  actions: FABAction[];
  mainIcon?: string;
  openIcon?: string;
};

const MultiFAB: React.FC<MultiFABProps> = ({
  actions,
  mainIcon = 'plus',
  openIcon = 'close',
}) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(prev => !prev);

  return (
    <View style={styles.container}>
      {open &&
        actions.map((action, index) => (
          <AppFAB
            key={index}
            icon={action.icon}
            label={action.label}
            onPress={() => {
              action.onPress();
              setOpen(false);
            }}
            style={[styles.fabOption, { marginBottom: (index + 1) * 70 }]}
          />
        ))}

      <AppFAB
        icon={open ? openIcon : mainIcon}
        onPress={handleToggle}
        style={styles.mainFab}
      />
    </View>
  );
};

export default MultiFAB;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'flex-end',
  },
  mainFab: {
    // optional custom style
  },
  fabOption: {
    position: 'absolute',
    right: 0,
  },
});