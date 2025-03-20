import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity, Text, Animated } from "react-native";

const SegmentedControl = ({ value, onChange, isBill }) => {

  if(isBill) {
    const options = ["Pending", "Completed", "Missed"];
  
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
            >
              <Text style={[styles.text, isSelected && styles.selectedText]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  const options = ["Splits", "Spends", "Settlements"];
  
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

export default function App({value, setValue, isBill}) {
  // const [value, setValue] = useState("splits");

  return (
    <View style={styles.wrapper}>
      <SegmentedControl value={value} onChange={setValue} isBill={isBill}/>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#e6eefc",
    borderRadius: 25,
    padding: 3,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  firstButton: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  lastButton: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  text: {
    color: "#4A627A",
    fontWeight: "500",
    fontSize: 14
  },
  selectedText: {
    fontWeight: "semibold",
    color: "#000",
  },
});