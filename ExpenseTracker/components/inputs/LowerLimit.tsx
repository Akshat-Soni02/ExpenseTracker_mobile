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
              // Remove any characters that are not digits or a dot
              let cleanedText = text.replace(/[^0-9.]/g, "");
            
              // Ensure only one dot is allowed
              const parts = cleanedText.split(".");
              if (parts.length > 2) {
                cleanedText = parts[0] + "." + parts[1];
              }
            
              onChange(cleanedText);
            }}
            keyboardType="decimal-pad"
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
    fontSize: 16,
    textAlign: "right",
    width: "30%",
    // flex: 1,
    fontFamily: "Poppins_400Regular",
    color: "#111827",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
  },
});