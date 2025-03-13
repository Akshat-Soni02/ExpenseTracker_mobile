import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";

interface Props {
  control: Control<any>;
}

const TitleInput: React.FC<Props> = ({ control }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        name="title"
        defaultValue=""
        render={({ field: { onChange, value } }) => {
          const memoizedValue = useMemo(() => value, [value]);

          return (
            <TextInput
              style={styles.titleInput}
              placeholder="Enter title"
              placeholderTextColor="#A0AEC0"
              value={memoizedValue}
              onChangeText={onChange}
              accessibilityLabel="Title input"
              accessibilityHint="Enter a title"
            />
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
    fontSize: 16,
    fontWeight: "600",
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
});