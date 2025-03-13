import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";
import { Control, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment","General"];

interface Props {
  control: Control<any>;
}

const CategorySelector: React.FC<Props> = ({ control }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <Controller
        control={control}
        name="category"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity style={styles.selectionContainer} onPress={() => setModalVisible(true)}>
              <Text style={[styles.buttonText, value ? styles.selectedText : styles.placeholderText]}>
                {value || "Select Category"}
              </Text>
              {value !== "" && (
                <TouchableOpacity onPress={() => onChange("")} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={18} color="black" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                  <FlatList
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.modalItem, value === item && styles.selectedItem]}
                        onPress={() => {
                          onChange(item);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={[styles.modalText, value === item && styles.selectedModalText]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1.5,
    borderColor: "rgba(150, 150, 150, 0.4)",
  },
  buttonText: {
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
  clearButton: {
    marginLeft: 10,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    width: "80%",
    alignItems: "center",
    maxHeight: "50%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalItem: {
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
  selectedItem: {
    backgroundColor: "rgba(0, 150, 255, 0.1)",
  },
  selectedModalText: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  cancelButton: {
    marginTop: 10,
    alignSelf: "center",
    paddingVertical: 10,
  },
  cancelText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CategorySelector;