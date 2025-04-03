import React, { useState,useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";

interface Props {
  control: Control<any>;
}

const InitialBudget: React.FC<Props> = ({ control }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Estimated Budget</Text>
      <Controller
        control={control}
        name="initialBudget"
        defaultValue=""
        render={({ field: { onChange, value } }) => {
          const displayValue = useMemo(() => (value ? String(value) : ""), [value]);
          
          return(
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#6B7280"
            value={displayValue}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              onChange(numericValue);
            }}
            keyboardType="numeric"
            returnKeyType="done"
            accessibilityLabel="Initial budget input"
            accessibilityHint="Enter the estimated budget amount"
          />
        );
        }}
      />
    </View>
  );
};

export default InitialBudget;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    minWidth: "50%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "#111827",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
  },
});