import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";

interface PaidBySelectorProps {
  control: any;
  name: string;
  users: { id: string; name: string }[];
}

const PaidBySelector: React.FC<PaidBySelectorProps> = ({ control, name, users }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View>
          {/* Paid By Display */}
          <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
            <Text style={styles.label}>Paid by</Text>
            <Text style={styles.selected}>{value?.name || "Select payer"}</Text>
          </TouchableOpacity>

          {/* Modal for Selection */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Payer</Text>
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        onChange(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selected: {
    fontSize: 16,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "red",
  },
});

export default PaidBySelector;
