import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Controller, Control } from "react-hook-form";

interface Props {
  control: Control<any>;
  label: string;
  update?: boolean;
  isAmountFrozen?: boolean; // New prop to freeze amount input

}

const AmountDescriptionInput: React.FC<Props> = ({ control, label, update, isAmountFrozen = false }) => {
  return (
    <View style={styles.container}>
      {/* Amount Section */}
      <Text style={styles.label}>Amount</Text>
      <View style={[styles.amountWrapper, isAmountFrozen && styles.disabledInputWrapper]}>
        <Text style={styles.currency}>₹</Text>
        <Controller
          control={control}
          name="amount"
          defaultValue={0}
          render={({ field: { onChange, value } }) => {
            const displayValue = useMemo(() => (value ? String(value) : ""), [value]);

            return (
              <TextInput
              style={[styles.amountInput, isAmountFrozen && styles.disabledText]}
              keyboardType="numeric"
                value={displayValue}
                placeholder="0"
                onChangeText={(text) => {
                  if (text === "" || isAmountFrozen) return;
                  const numericValue = parseFloat(text);
                  if (!isNaN(numericValue)) {
                    onChange(numericValue);
                  }
                }}
                editable={!isAmountFrozen} // Freezing the input
                selectTextOnFocus={!isAmountFrozen} // Prevent selection if frozen
                accessibilityLabel="Amount input"
                accessibilityHint={isAmountFrozen ? "Amount is locked" : "Enter the amount in rupees"}
              />
            );
          }}
        />
      </View>
      <View style={styles.separator} />

      {/* Description Section */}
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={label}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity activeOpacity={0.8}>
            <TextInput
              style={[styles.descriptionInput, !value && styles.placeholderText]}
              placeholder="Tap to add"
              placeholderTextColor="#A0AEC0"
              value={value}
              onChangeText={onChange}
              accessibilityLabel={`${label} input`}
              accessibilityHint={`Tap to enter a ${label}`}
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
    borderRadius: 12,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  // rgba(240, 240, 240, 0.6)
  // rgba(200, 230, 255, 0.4)
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 5,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  currency: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginRight: 5,
  },
  amountInput: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
    color: "#333",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    width: "80%",
    alignSelf: "center",
    marginVertical: 8,
  },
  descriptionInput: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
  },
  placeholderText: {
    color: "#A0AEC0",
    fontStyle: "italic",
  },
  disabledInputWrapper: {
    backgroundColor: "#E0E0E0", // Light gray background when disabled
  },
  disabledText: {
    color: "#A0AEC0", // Gray text when disabled
  },
});


