import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";
import { Control, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment"];

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
            <View style={styles.selectionContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text>{value || "Select Category"}</Text>
              </TouchableOpacity>
              {value !== "" && (
                <TouchableOpacity onPress={() => onChange("")} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="black" />
                </TouchableOpacity>
              )}
            </View>

            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                  <FlatList
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          onChange(item);
                          setModalVisible(false);
                        }}
                      >
                        <Text>{item}</Text>
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
  label: { fontSize: 16, fontWeight: "bold" },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: { paddingVertical: 10, fontSize: 18 },
  clearButton: {
    marginLeft: 10,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "flex-start", // Align text to start
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalItem: {
    padding: 10,
    width: "100%", // Ensure it takes full width
  },
  cancelButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  cancelText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CategorySelector;