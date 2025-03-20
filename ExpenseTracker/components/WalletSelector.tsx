import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { useGetUserWalletsQuery } from "@/store/userApi";

interface WalletSelectorProps {
  control: any;
  name: string;
  isFrozen?;boolean;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ control, name,isFrozen=false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data, isLoading } = useGetUserWalletsQuery();
  
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>Select Wallet</Text>
          
          {!isLoading && (
            <View style={[styles.selectionContainer, isFrozen && styles.disabledInputWrapper]}>
            {/* <TouchableOpacity
              style={styles.selectionContainer}
              onPress={() => setModalVisible(true)}
            > */}
            <TouchableOpacity
              disabled={isFrozen} // Freezing selection
              onPress={() => !isFrozen && setModalVisible(true)}
            >
              <Text style={[styles.tap, isFrozen && styles.disabledText]}>{value?.wallet_title || "Tap to select"}</Text>
            </TouchableOpacity>

              {value && !isFrozen && (
                <TouchableOpacity onPress={() => onChange(null)} style={styles.removeButton}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={data?.data}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        onChange(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalText}>{item.wallet_title}</Text>
                      <Text style={styles.modalAmount}>₹{item.amount}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
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
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    width: "50%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  tap: {
    color: "#252626",
    fontSize: 15,
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  removeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  modalText: {
    fontSize: 17,
    color: "#000",
  },
  modalAmount: {
    fontSize: 16,
    color: "#555",
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  disabledInputWrapper: {
    backgroundColor: "#E0E0E0", // Light gray background when disabled
  },
  disabledText: {
    color: "#A0AEC0", // Gray text when disabled
  },
});

export default WalletSelector;