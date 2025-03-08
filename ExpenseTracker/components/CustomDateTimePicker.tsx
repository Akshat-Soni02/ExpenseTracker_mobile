import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Control, Controller } from "react-hook-form";

interface CustomDateTimePickerProps {
  control: Control<any>;
  name: string;
  label: string;
}

const formatDate = (dateString: string | null, label: string) => {
  if (!dateString) return "Select"; // Default placeholder
  const date = new Date(dateString);

  if (label === "Time") {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  } else {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  }
};

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({ control, name, label }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        defaultValue={null}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
              <Text style= {styles.btnText}>{formatDate(value, label)}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode={label === "Time" ? "time" : "date"}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) {
                    onChange(selectedDate.toISOString());
                  }
                }}
              />
            )}
          </>
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
    paddingHorizontal: 10,
    paddingTop: 10,
    width: "50%",
  },
  label: { fontSize: 16, fontWeight: "bold", alignSelf: "center" },
  button: { padding: 10, borderRadius: 5, alignSelf: "center" },
  btnText: {fontSize: 18}
});

export default CustomDateTimePicker;