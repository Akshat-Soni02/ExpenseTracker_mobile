import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  Platform,
  TouchableNativeFeedback,
  View,
} from "react-native";

interface CustomButtonProps {
  children: React.ReactNode;
  disabled?: any;
  onPress?: (event: GestureResponderEvent) => void;
  style?: object;
  innerStyle?: object;
  variant?: "filled" | "outline";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  disabled,
  onPress,
  style,
  variant = "filled",
  innerStyle
}) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);

  const ButtonComponent = Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <View style={[styles.buttonWrapper, style]}>
      <ButtonComponent
        disabled = {disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        background={
          Platform.OS === "android"
            ? TouchableNativeFeedback.Ripple("#FFFFFF", false)
            : undefined
        }
      >
        <View
          style={[
            styles.button,
            variant === "outline" ? styles.outlineButton : styles.filledButton,
            pressed && styles.buttonPressed,
            innerStyle
          ]}
        >
          <Text style={[styles.text, variant === "outline" && styles.outlineText, innerStyle]}>
            {children}
          </Text>
        </View>
      </ButtonComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 5,
    overflow: "hidden",
  },
  button: {
    width: 300,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 2,
  },
  filledButton: {
    backgroundColor: "#355C7D",
    borderColor: "#355C7D",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderColor: "#355C7D",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  text: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    fontWeight: "semibold",
    color: "#fff",
  },
  outlineText: {
    color: "#355C7D",
  },
});

export default CustomButton;