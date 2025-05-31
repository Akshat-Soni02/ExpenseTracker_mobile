import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";

type SettingsRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  editable?: boolean;
  editing?: boolean;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  rightElement?: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  danger?: boolean;
};

const SettingsRow = ({
  icon,
  label,
  value,
  editable,
  editing,
  onPress,
  onChangeText,
  rightElement,
  keyboardType,
  danger,
}: SettingsRowProps) => {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={editable || onPress ? 0.7 : 1}
    >
      <View style={styles.left}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.label, danger && { color: "#EF4444" }]}>{label}</Text>
      </View>
      <View style={styles.right}>
        {editable && editing ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            style={styles.input}
            keyboardType={keyboardType}
            placeholder="Enter"
          />
        ) : rightElement ? (
          rightElement
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SettingsRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: "#374151",
  },
  value: {
    fontSize: 16,
    color: "#6B7280",
  },
  input: {
    fontSize: 16,
    color: "#111827",
    borderBottomWidth: 1,
    borderColor: "#D1D5DB",
    minWidth: 100,
  },
  right: {
    flexShrink: 1,
  },
});