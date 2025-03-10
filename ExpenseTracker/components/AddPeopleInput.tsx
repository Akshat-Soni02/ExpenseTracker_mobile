import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, Control } from "react-hook-form";
import CustomButton from "./button/CustomButton";

const staticUsers = [
  { id: "1", name: "You" },
  { id: "2", name: "Alice" },
  { id: "3", name: "Bob" },
  { id: "4", name: "Charlie" },
  { id: "5", name: "David" },
  { id: "6", name: "Eve" },
  { id: "7", name: "Frank" },
  { id: "8", name: "Grace" },
];

interface Props {
  control: Control<any>;
  des? : string;
  update? : boolean;
}

const AddPeopleInput: React.FC<Props> = ({ control, des, update }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name="selectedUsers"
      defaultValue={[staticUsers[0]]}
      render={({ field: { value: selectedUsers, onChange } }) => {
        const toggleUserSelection = (user) => {
          let newSelectedUsers;
          if (selectedUsers.some((u) => u.id === user.id)) {
            newSelectedUsers = selectedUsers.filter((u) => u.id !== user.id);
          } else {
            newSelectedUsers = [...selectedUsers, user];
          }
          onChange(newSelectedUsers);
        };

        return (
          <View style={styles.container}>
            <Text style={styles.title}>Add People</Text>

            {/* Selected Users */}
            <View style={styles.selectedUsersContainer}>
              {selectedUsers.map((user) => (
                <View key={user.id} style={styles.splitItem}>
                  <View style={styles.userIcon} />
                  <Text style={styles.userName}>{user.name}</Text>
                </View>
              ))}
            </View>
            
            {/* Add People Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                {des ? (<Text style={styles.addButtonText}>{des}</Text>) : (<Text style={styles.addButtonText}>Add People</Text>)}
            </TouchableOpacity>

            {/* People Selection Modal */}
            <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
              <View style={styles.fullScreenModal}>
                <Text style={styles.modalTitle}>Select People</Text>
                <FlatList
                  data={staticUsers}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const isSelected = selectedUsers.some((u) => u.id === item.id);
                    return (
                      <TouchableOpacity onPress={() => toggleUserSelection(item)} style={[styles.modalItem, isSelected && styles.selectedItem]}>
                        <Text style={styles.modalItemText}>{item.name}</Text>
                        {isSelected && <Ionicons name="checkmark" size={20} color="black" />}
                      </TouchableOpacity>
                    );
                  }}
                />
                <CustomButton onPress={() => setModalVisible(false)}>Done</CustomButton>
              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
};

export default AddPeopleInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderRadius: 15,
    padding: 10,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
  selectedUsersContainer: {
    padding: 10,
    borderRadius: 10,
  },
  splitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2.5,
    backgroundColor: "rgba(200, 230, 255, 0.7)",
    padding: 10,
    borderRadius: 10,
  },
  userIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFD700",
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    color: "#000",
    flex: 1,
  },
  addButton: {
    backgroundColor: "rgb(56, 88, 114)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 18,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "rgba(200, 230, 255, 0.2)",
    marginVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  modalItemText: {
    color: "#000",
    fontSize: 18,
  },
  selectedItem: {
    backgroundColor: "rgba(111, 187, 250, 0.24)",
  },
});
