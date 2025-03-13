import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { View, TextInput, StyleSheet, Text } from "react-native";

interface NotesInputProps {
  control: any;
  name: string;
}

const NotesInput: React.FC<NotesInputProps> = ({ control, name }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      <Text style={styles.label}>Notes</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Tap to add notes..."
            placeholderTextColor="rgba(80, 80, 80, 0.6)"
            multiline
            value={value}
            onChangeText={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  focusedContainer: {
    // borderColor: "rgba(100, 160, 255, 0.8)",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(60, 60, 60, 0.95)",
    marginBottom: 6,
  },
  input: {
    minHeight: 40,
    fontSize: 15,
    color: "#333",
    textAlignVertical: "top",
  },
});

export default NotesInput;