import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/store/categoryApi";
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type CategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  defaultName?: string;
  title?: string;
};

const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  onSubmit,
  defaultName = "",
  title = "Category",
}) => {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    setName(defaultName); // Reset on open
  }, [defaultName, visible]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>{defaultName ? `Edit ${title}` : `Create ${title}`}</Text>

          <TextInput
            placeholder="Enter category name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            autoFocus
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
              <Text style={styles.submitText}>{defaultName ? "Update" : "Create"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 20,
    },
    modal: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    header: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    cancelBtn: {
        padding: 10,
    },
    cancelText: {
        color: "#888",
        fontWeight: "500",
    },
    submitBtn: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    submitText: {
        color: "white",
        fontWeight: "600",
    },
});
  