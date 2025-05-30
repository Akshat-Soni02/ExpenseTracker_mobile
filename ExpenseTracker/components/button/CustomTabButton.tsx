import React from "react";
import { Pressable, View, StyleSheet, Platform } from "react-native";

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  isFocused?: boolean;
}

export const CustomTabButton: React.FC<Props> = ({
  children,
  onPress,
  onLongPress,
  isFocused,
}) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      android_ripple={null} // disables ripple
      style={({ pressed }) => [
        styles.button,
        Platform.OS === "ios" && pressed ? { opacity: 1 } : {}, // disables iOS press effect
      ]}
    >
      {isFocused && <View style={styles.topIndicator} />}
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  topIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 2,
    width: "100%",
    backgroundColor: "#1D3557",
  },
});