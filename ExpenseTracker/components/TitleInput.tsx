import React from "react";
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
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.titleInput}
            placeholder="Enter title"
            placeholderTextColor="#A0AEC0"
            value={value}
            onChangeText={onChange}
            accessibilityLabel="Title input"
            accessibilityHint="Enter a title"
          />
        )}
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
  titleInput: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },
});