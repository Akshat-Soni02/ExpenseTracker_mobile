import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity} from "react-native";
import { Controller, Control } from "react-hook-form";
import { FieldError } from "react-hook-form";
import { globalStyles } from "@/styles/globalStyles";

interface Props {
  control: Control<any>;
  label: string;
  update?: boolean;
  isAmountFrozen?: boolean;
  onErrorsChange: any;
  childErrors?: any
}

export type error = {
  message: string;
}

type localError = {
  [key: string]: error;
}

export type FormErrors = {
  [key: string]: FieldError | undefined;
};

const AmountDescriptionInput: React.FC<Props> = ({ control, label, isAmountFrozen = false, onErrorsChange, childErrors}) => {
  // const [localError, setLocalError] = useState<localError>({});

  return (
    <View style={styles.container}>

      {/* Amount Section */}
      <Text style={styles.label}>Amount<Text style={styles.asterisk}>*</Text></Text>
      <View style={[styles.amountWrapper, isAmountFrozen && styles.disabledInputWrapper]}>
        <Text style={styles.currency}>₹</Text>
        <Controller
          control={control}
          name="amount"
          defaultValue={0}
          rules={{
            required: "Amount is required",
            validate: (value) => (value > 0 ? true : "Amount must be greater than zero"),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            useEffect(() => {
              onErrorsChange((prevErrors: FormErrors) => {
                const updatedErrors = { ...prevErrors };
                if (error) {
                  updatedErrors.amount = error;
                } else {
                  delete updatedErrors.amount;
                }
                return updatedErrors;
              });
            }, [error]);
            

            const displayValue = useMemo(() => (value ? String(value) : ""), [value]);

            return (
              <>
                <TextInput
                  style={[
                    styles.amountInput,
                    isAmountFrozen && styles.disabledText,
                  ]}
                  keyboardType="decimal-pad"
                  value={displayValue}
                  placeholder="0"
                  onChangeText={(text) => {
                    if (isAmountFrozen) return;
                  
                    // Always pass raw input first
                    // onChange(text);
                  
                    // // If empty, just allow clearing
                    // if (text === "") return;
                  
                    // // Allow intermediate states like "-", ".", "-."
                    // if (text === "-" || text === "." || text === "-.") return;
                  
                    // // Try parsing to float and only update when valid
                    // const numericValue = parseFloat(text);
                    // if (!isNaN(numericValue)) {
                    //   onChange(numericValue);
                    // }
                    const isValid = /^\d*\.?\d*$/.test(text);
                    if (isValid) {
                      onChange(text);
                    }
                  }}
                  editable={!isAmountFrozen}
                  selectTextOnFocus={!isAmountFrozen}
                  accessibilityLabel="Amount input"
                  accessibilityHint={isAmountFrozen ? "Amount is locked" : "Enter the amount in rupees"}
                />
              </>
            );
          }}
        />
      </View>
      {childErrors?.amount && <Text style = {globalStyles.redTextError}>{childErrors.amount.message}</Text>}
      <View style={styles.separator} />

      {/* Description Section */}
      <Text style={styles.label}>{label}<Text style={styles.asterisk}>*</Text></Text>
      <Controller
        control={control}
        name={label}
        defaultValue=""
        rules={{ required: `${label} is required` }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          useEffect(() => {
            onErrorsChange((prevErrors: FormErrors) => {
              const updatedErrors = { ...prevErrors };
          
              if (error) {
                updatedErrors[label] = error;
              } else {
                delete updatedErrors[label];
              }
          
              return updatedErrors;
            });
          }, [error, label]);

          return (
            <TouchableOpacity activeOpacity={0.8}>
              <TextInput
                style={[
                  styles.descriptionInput,
                  !value && styles.placeholderText,
                ]}
                placeholder="Tap to add"
                placeholderTextColor="#A0AEC0"
                value={value}
                onChangeText={onChange}
                accessibilityLabel={`${label} input`}
                accessibilityHint={`Tap to enter a ${label}`}
              />
            </TouchableOpacity>
          );
        }}
      />
      {childErrors?.Description && <Text style = {[globalStyles.redTextError, {marginTop: 5}]}>{childErrors.Description.message}</Text>}
      {childErrors?.Title && <Text style = {[globalStyles.redTextError, {marginTop: 5}]}>{childErrors.Title.message}</Text>}
      {childErrors?.Name && <Text style = {[globalStyles.redTextError, {marginTop: 5}]}>{childErrors.Name.message}</Text>}
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
    // textAlign: "center",
  },
  placeholderText: {
    color: "#A0AEC0",
    fontStyle: "italic",
    // textAlign: "center"

  },
  disabledInputWrapper: {
    backgroundColor: "#E0E0E0", // Light gray background when disabled
  },
  disabledText: {
    color: "#A0AEC0", // Gray text when disabled
  },
  asterisk: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f85454',
  }
});


