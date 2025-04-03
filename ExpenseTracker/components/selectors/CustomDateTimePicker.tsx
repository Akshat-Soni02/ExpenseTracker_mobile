import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Control, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

interface CustomDateTimePickerProps {
  control: Control<any>;
  name: string;
  label: "Date" | "Time";
  useDefaultToday?: boolean;
  heading: string;
  disableFutureDates?: boolean;
}

const formatDate = (dateString: string | null, label: "Date" | "Time") => {
  if (!dateString) return "Select";
  const date = new Date(dateString);

  return label === "Time"
    ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    : date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  control,
  name,
  label,
  useDefaultToday,
  heading,
  disableFutureDates
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{heading}</Text>
      <Controller
        control={control}
        name={name}
        defaultValue={useDefaultToday ? new Date().toISOString() : null}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity style={styles.selectionContainer} onPress={() => setShowPicker(true)}>
              <Text style={[styles.btnText, value ? styles.selectedText : styles.placeholderText]} numberOfLines={1}>
                {formatDate(value, label)}
              </Text>
              <Ionicons name={label === "Time" ? "time-outline" : "calendar-outline"} size={20} color="#555" />
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode={label === "Time" ? "time" : "date"}
                display="default"
                maximumDate={label === "Date" && disableFutureDates ? new Date() : undefined}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) {
                    onChange(selectedDate.toISOString());
                  } else if (!useDefaultToday) {
                    onChange(null);
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
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    paddingHorizontal: 12,
    paddingTop: 8,
    width: "50%",
    height: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 6,
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(150, 150, 150, 0.4)",
    backgroundColor: "#fff", // Removed transparency
  },
  btnText: {
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: "#888",
  },
  selectedText: {
    color: "#333",
    fontWeight: "600",
  },
});

export default CustomDateTimePicker;