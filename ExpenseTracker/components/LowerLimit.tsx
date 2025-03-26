import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";

interface Props {
  control: Control<any>;
}

const LowerLimit: React.FC<Props> = ({ control }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Lower Limit</Text>
      <Controller
        control={control}
        name="lowerLimit"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#6B7280"
            value={value}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, ""); // Restrict to numbers only
              onChange(numericValue);
            }}
            keyboardType="numeric"
            returnKeyType="done"
            accessibilityLabel="Lower limit input"
            accessibilityHint="Enter the lower limit amount"
          />
        )}
      />
    </View>
  );
};

export default LowerLimit;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "semibold",
    fontFamily: "Poppins_700Bold",
    color: "#1F2937",
    marginRight: 12,
  },
  input: {
    fontSize: 18,
    textAlign: "right",
    width: "50%",
    // flex: 1,
    fontFamily: "Poppins_400Regular",
    color: "#111827",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
  },
});