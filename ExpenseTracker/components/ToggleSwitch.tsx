import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Control, Controller } from "react-hook-form";

interface ToggleSwitchProps {
  control: Control<any>;
  name: string;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ control, name, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <Switch 
            value={value} 
            onValueChange={onChange} 
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
            thumbColor={value ? "#fff" : "#f4f3f4"}
            style = {styles.switch}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    width: "100%",
    // height: "100%"
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ToggleSwitch;
