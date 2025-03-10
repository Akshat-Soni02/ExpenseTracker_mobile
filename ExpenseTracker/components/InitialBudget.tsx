import React from "react";
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
        defaultValue="0"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter initial budget"
            placeholderTextColor="#A0AEC0"
            value={String(value)}
            onChangeText={onChange}
            keyboardType="numeric"
            accessibilityLabel="Initial budget input"
            accessibilityHint="Enter the initial budget amount"
          />
        )}
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
    padding: 10,
    // alignItems: "center",
    height: "100%",
    width: "50%",
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
    marginBottom: 5,
    alignSelf: "center"
  },
  input: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },
});
