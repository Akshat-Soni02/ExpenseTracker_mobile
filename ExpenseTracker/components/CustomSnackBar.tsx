import React from "react";
import { Text, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

interface SnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const CustomSnackBar: React.FC<SnackbarProps> = ({
  visible,
  onDismiss,
  message,
  action,
}) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      style={styles.snackbar}
      action={action}
    >
      <Text style={styles.message}>{message}</Text>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
    snackbar: {
        backgroundColor: "#f2f2f2", // Light grey
        borderRadius: 10,
        alignSelf: "center",
        paddingHorizontal: 8,
      },
      message: {
        color: "#1a1a1a", // Almost black for visibility
        fontSize: 15,
        fontWeight: "500",
      },
});

export default CustomSnackBar;
