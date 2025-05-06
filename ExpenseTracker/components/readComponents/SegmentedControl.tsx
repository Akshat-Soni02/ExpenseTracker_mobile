import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface SegmentProps {
  value: string;
  onChange: (newState: string | ((prevState: string) => string)) => void;
  isBill: boolean;
}

interface AppProps {
  value: string;
  setValue: (newState: string | ((prevState: string) => string)) => void;
  isBill: boolean;
}

const SegmentedControl: React.FC<SegmentProps> = ({ value, onChange, isBill }) => {
  const options = isBill ? ["Pending", "Completed", "Missed"] : ["Splits", "Transactions", "Settlements"];
  
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = value === option.toLowerCase();

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              isSelected && styles.selectedButton,
              index === 0 && styles.firstButton,
              index === options.length - 1 && styles.lastButton,
            ]}
            onPress={() => onChange(option.toLowerCase())}
            activeOpacity={0.8} // Reduce opacity effect on press
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function App({ value, setValue, isBill }: AppProps) {
  return (
    <View style={styles.wrapper}>
      <SegmentedControl value={value} onChange={setValue} isBill={isBill} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#e6eefc",
    borderRadius: screenWidth * 0.05,
    padding: screenWidth * 0.01,
    width: screenWidth * 0.9,
  },
  button: {
    width: "33%",
    paddingVertical: screenHeight * 0.015,
    alignItems: "center",
    borderRadius: screenWidth * 0.04,
  },
  selectedButton: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  firstButton: {
    borderTopLeftRadius: screenWidth * 0.05,
    borderBottomLeftRadius: screenWidth * 0.05,
  },
  lastButton: {
    borderTopRightRadius: screenWidth * 0.05,
    borderBottomRightRadius: screenWidth * 0.05,
  },
  text: {
    color: "#4A627A",
    fontWeight: "500",
    fontSize: screenWidth * 0.035,
  },
  selectedText: {
    fontWeight: "600",
    color: "#000",
  },
});
