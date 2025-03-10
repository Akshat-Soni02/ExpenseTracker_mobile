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
        defaultValue="0"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter lower limit"
            placeholderTextColor="#A0AEC0"
            value={String(value)}
            onChangeText={onChange}
            keyboardType="numeric"
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
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderRadius: 15,
    padding: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: "hidden",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    color: "#000",
    marginRight: 10,
  },
  input: {
    fontSize: 18,
    textAlign: "right",
    flex: 1,
    fontFamily: "Poppins_400Regular",
    color: "#000",
    paddingRight: 3
  },
});
