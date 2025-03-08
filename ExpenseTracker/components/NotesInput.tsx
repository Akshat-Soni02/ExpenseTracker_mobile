import React from "react";
import { Controller } from "react-hook-form";
import { View, TextInput, StyleSheet, Text } from "react-native";

interface NotesInputProps {
  control: any;
  name: string;
}

const NotesInput: React.FC<NotesInputProps> = ({ control, name }) => {
  return (
    <View style={styles.container}>
    <Text style={styles.label}>Notes</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextInput
          style={styles.input}
          placeholder="Tap to add notes"
          multiline
          value={value}
          onChangeText={onChange}
        />
      )}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    // borderWidth: 2,
    // borderRadius: 8,
    // padding: 10,
    minHeight: 30,
    textAlignVertical: "top",
    // backgroundColor: "rgba(200, 230, 255, 0.4)"
  },
  container: {
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 10
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(80, 80, 80, 0.95)",
    marginBottom: 5,
  }
});

export default NotesInput;