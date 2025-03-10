import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { useGetUserWalletsQuery } from "@/store/userApi";

interface WalletSelectorProps {
  control: any;
  name: string;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ control, name }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data, isLoading, error } = useGetUserWalletsQuery();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>Select Wallet</Text>
          
          {!isLoading && (
              <View style={styles.selectionContainer}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.tap}>{value?.wallet_title || "Tap to select"}</Text>
              </TouchableOpacity>
  
              {/* Show Remove button if a wallet is selected */}
              {value && (
                <TouchableOpacity onPress={() => onChange(null)} style={styles.removeButton}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          

          <Modal visible={modalVisible} transparent animationType="slide">
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
                      <Text style={styles.modalText}>₹{item.amount}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancel}>Cancel</Text>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 7,
    // alignSelf: "center",
  },
  tap: {
    color: "rgb(37, 38, 38)",
    // fontSize: 18,
  },
  container: {
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingInline: 10,
    paddingTop: 10,
    width: "50%",
    height: "100%",
    // justifyContent: "center",
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  removeButton: {
    marginLeft: 10,
    // backgroundColor: "rgba(255, 0, 0, 0.2)",
    // paddingHorizontal: 5,
    // paddingVertical: 1,
    borderRadius: 10,
  },
  removeText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
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
  cancel: {
    fontSize: 20,
    color: "rgba(0, 0, 0, 0.77)",
    fontWeight: "500",
    alignSelf: "center",
    marginTop: 5,
  },
  modalItem: {
    paddingVertical: 15,
    width: "100%",
    backgroundColor: "rgba(200, 230, 255, 0.1)",
    marginVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalText: {
    color: "#000",
    fontSize: 18,
  },
});

export default WalletSelector;