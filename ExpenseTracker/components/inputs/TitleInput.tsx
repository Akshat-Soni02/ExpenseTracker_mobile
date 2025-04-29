import React, { useEffect, useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";
import { FormErrors } from "./AmountDescriptionInput";
import { globalStyles } from "@/styles/globalStyles";

interface Props {
  control: Control<any>;
  onErrorsChange: any;
  childErrors?: any;
}

const TitleInput: React.FC<Props> = ({ control, onErrorsChange, childErrors }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title<Text style={styles.asterisk}>*</Text></Text>
      <Controller
        control={control}
        name="title"
        defaultValue=""
        rules={{ required: `Title is required` }}
        render={({ field: { onChange, value }, fieldState: {error} }) => {
          const memoizedValue = useMemo(() => value, [value]);
          useEffect(() => {
            onErrorsChange((prevErrors: FormErrors) => {
              const updatedErrors = { ...prevErrors };
              if (error) {
                updatedErrors.Title = error;
              } else {
                delete updatedErrors.Title;
              }
              return updatedErrors;
            });
          }, [error]);
          return (
            <>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter title"
              placeholderTextColor="#A0AEC0"
              value={memoizedValue}
              onChangeText={onChange}
              accessibilityLabel="Title input"
              accessibilityHint="Enter a title"
            />
            {childErrors?.Title && <Text style = {globalStyles.redTextError}>{childErrors.Title.message}</Text>}
            </>
          );
        }}
      />
    </View>
  );
};

export default TitleInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    overflow: "hidden",
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Poppins_600SemiBold",
    color: "#000",
    marginBottom: 6,
  },
  titleInput: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "#000",
    width: "100%", // Ensures no unwanted wrapping
    paddingVertical: 6,
  },
  asterisk: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f85454',
  }
});