import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Controller, Control } from "react-hook-form";
import { BlurView } from "expo-blur";

interface Props {
  control: Control<any>;
}

const AmountDescriptionInput: React.FC<Props> = ({ control }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountWrapper}>
        <Text style={styles.currency}>₹</Text>
        <Controller
          control={control}
          name="amount"
          defaultValue={0}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={String(value)}
              onChangeText={onChange}
              accessibilityLabel="Amount input"
              accessibilityHint="Enter the amount in rupees"
            />
          )}
        />
      </View>
      <View style={styles.separator} />

      {/* Description Section */}
      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
            <TextInput
              style={[styles.descriptionInput, !value && styles.placeholderText]}
              placeholder="Tap to add"
              placeholderTextColor="#A0AEC0"
              value={value}
              onChangeText={onChange}
              accessibilityLabel="Description input"
              accessibilityHint="Tap to enter a description"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AmountDescriptionInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)", 
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    // rgba(200, 230, 255, 0.4)
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: "hidden",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    color: "#000",
    marginBottom: 5,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  currency: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 5,
    fontFamily: "Poppins_700Bold",
    color: "#000",
  },
  amountInput: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    color: "#000",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(5, 5, 5, 0.3)",
    width: "50%",
    marginVertical: 5,
  },
  descriptionInput: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },
  placeholderText: {
    color: "#A0AEC0",
    fontStyle: "italic",
  },
});
