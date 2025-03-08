// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Modal } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { BlurView } from "expo-blur";
// import { LinearGradient } from 'expo-linear-gradient';
// import CustomButton from "./button/CustomButton";
// import { Control } from "react-hook-form";

// const staticUsers = [
//   { id: "1", name: "You" },
//   { id: "2", name: "Alice" },
//   { id: "3", name: "Bob" },
//   { id: "4", name: "Charlie" },
//   { id: "5", name: "David" },
//   { id: "6", name: "Eve" },
//   { id: "7", name: "Frank" },
//   { id: "8", name: "Grace" },
// ];

// interface Props {
//   control: Control<any>;
//   amount: any;
// }

// const SplitWithSelector: React.FC<Props> = ({ control, amount }) => {
//   const [selectedUsers, setSelectedUsers] = useState([staticUsers[0]]);
//   const [splitAmounts, setSplitAmounts] = useState({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [paidByModalVisible, setPaidByModalVisible] = useState(false);
//   const [paidBy, setPaidBy] = useState(staticUsers[0]);

//   useEffect(() => {
//     if (selectedUsers.length > 0) {
//       const equalSplit = (amount / selectedUsers.length).toFixed(2);
//       const newSplits = {};
//       selectedUsers.forEach((user) => {
//         newSplits[user.id] = equalSplit;
//       });
//       setSplitAmounts(newSplits);
//     }
//   }, [amount, selectedUsers]);

//   const toggleUserSelection = (user) => {
//     if (selectedUsers.some((u) => u.id === user.id)) {
//       setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
//     } else {
//       setSelectedUsers([...selectedUsers, user]);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Split with</Text>

//       {/* Selected Users */}
//       <View style={styles.selectedUsersContainer}>
//         {selectedUsers.map((user) => (
//           <View key={user.id} style={styles.splitItem}>
//             <View style={styles.userIcon} />
//             <Text style={styles.userName}>{user.name}</Text>
//             <TextInput
//               style={styles.amountInput}
//               value={splitAmounts[user.id]?.toString() || "0"}
//               onChangeText={(text) => {
//                 setSplitAmounts({ ...splitAmounts, [user.id]: text });
//               }}
//               keyboardType="numeric"
//             />
//           </View>
//         ))}
//       </View>

//       {/* Add People Button */}
//       <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//         <Text style={styles.addButtonText}>Add People</Text>
//       </TouchableOpacity>

//       {/* Paid By Selection */}
//       <View style={styles.paidByContainer}>
//         <Text style={styles.paidByText}>Paid by</Text>
//         <TouchableOpacity style={styles.paidByButton} onPress={() => setPaidByModalVisible(true)}>
//           <Text style={styles.paidByButtonText}>{paidBy.name}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* People Selection Modal */}
//       <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.fullScreenModal}>
//           <Text style={styles.modalTitle}>Select People</Text>
//           <FlatList
//             data={staticUsers}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => {
//               const isSelected = selectedUsers.some((u) => u.id === item.id);
//               return (
//                 <TouchableOpacity onPress={() => toggleUserSelection(item)} style={[styles.modalItem, isSelected && styles.selectedItem ]}>
//                   <Text style={[styles.modalItemText]}>
//                     {item.name}
//                   </Text>
//                   {isSelected && <Ionicons name="checkmark" size={20} color="black" />}
//                 </TouchableOpacity>
//               );
//             }}
//           />
//           <CustomButton onPress={() => setModalVisible(false)}>Done</CustomButton>
//           {/* <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(false)}>
//             <Text style={styles.addButtonText}>Done</Text>
//           </TouchableOpacity> */}
//         </View>
//       </Modal>

//       {/* Paid By Selection Modal */}
//       <Modal animationType="slide" transparent={false} visible={paidByModalVisible} onRequestClose={() => setPaidByModalVisible(false)}>
//         <View style={styles.fullScreenModal}>
//           <Text style={styles.modalTitle}>Select Payer</Text>
//           <FlatList
//             data={staticUsers}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => {
//               const isSelected = paidBy.id === item.id;
//               return (
//                 <TouchableOpacity onPress={() => { setPaidBy(item); setPaidByModalVisible(false); }} style={[styles.modalItem, isSelected && styles.selectedItem]}>
//                   <Text style={[styles.modalItemText]}>{item.name}</Text>
//                   {isSelected && <Ionicons name="checkmark" size={20} color="black" />}
//                 </TouchableOpacity>
//               );
//             }}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default SplitWithSelector;

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 2,
//     borderColor: "rgba(255, 255, 255, 0.2)",
//     backgroundColor: "rgba(200, 230, 255, 0.4)",
//     //  rgba(30, 42, 71, 0.9)
//     borderRadius: 15,
//     padding: 10,
//     width: "100%",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     textAlign: "center",
//     marginBottom: 5,
//   },
//   selectedUsersContainer: {
//     padding: 10,
//     borderRadius: 10,
//   },
//   splitItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 2.5,
//     backgroundColor: "rgba(200, 230, 255, 0.7)",
//     padding: 10,
//     borderRadius: 10,
//   },
//   userIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: "#FFD700",
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 18,
//     color: "#000",
//     flex: 1,
//   },
//   amountInput: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#000",
//     width: 60,
//     textAlign: "right",
//     color: "#000",
//     fontSize: 18,
//   },
//   addButton: {
//     backgroundColor: "rgb(56, 88, 114)",
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: "#fff",
//     fontWeight: "500",
//     fontSize: 18,
//   },
//   paidByContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 15,
//     alignSelf: "center",
//   },
//   paidByText: {
//     fontSize: 16,
//     color: "#000",
//   },
//   paidByButton: {
//     backgroundColor: "#333",
//     padding: 10,
//     borderRadius: 10,
//     marginLeft: 10,
//   },
//   paidByButtonText: {
//     color: "#FFF",
//   },
//   fullScreenModal: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 10,
//   },
//   modalItem: {
//     paddingVertical: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     backgroundColor: "rgba(200, 230, 255, 0.2)",
//     marginVertical: 2,
//     // padding: 6,
//     paddingInline: 6,
//     borderRadius: 5
//     // borderBottomWidth: 1,
//     // borderBottomColor: "#555",
//   },
//   modalItemText: {
//     color: "#000",
//     fontSize: 18,
//   },
//   selectedItem: {
//     // fontWeight: "bold",
//     backgroundColor: "rgba(111, 187, 250, 0.24)"

//     // color: "#4CAF50",
//   },
//   closeButton: {
//     marginTop: 10,
//   },
//   closeButtonText: {
//     color: "#000",
//     fontSize: 20,
//   },
// });

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Control, Controller, useWatch, UseFormSetValue } from "react-hook-form";
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
  amount: number;
  setValue: (name: string, value: any) => void;
}


const SplitWithSelector: React.FC<Props> = ({ control, setValue, amount }) => {
  const [selectedUsers, setSelectedUsers] = useState([staticUsers[0]]);
  const [splitAmounts, setSplitAmounts] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [paidByModalVisible, setPaidByModalVisible] = useState(false);
  const [paidBy, setPaidBy] = useState(staticUsers[0]);

  // Watch 'splitWith' from react-hook-form
  const splitWith = useWatch({ control, name: "splitWith" });

  useEffect(() => {
    if (selectedUsers.length > 0) {
      const equalSplit = (amount / selectedUsers.length).toFixed(2);
      const newSplits: Record<string, string> = {};
      selectedUsers.forEach((user) => {
        newSplits[user.id] = equalSplit;
      });

      setSplitAmounts(newSplits);

      // Update form state
      const updatedArray = selectedUsers.map((user) => ({
        name: user.name,
        amount: newSplits[user.id],
      }));

      setValue("splitWith", updatedArray);
    }
  }, [amount, selectedUsers]);

  const toggleUserSelection = (user: { id: string; name: string }) => {
    let newSelectedUsers;
    if (selectedUsers.some((u) => u.id === user.id)) {
      newSelectedUsers = selectedUsers.filter((u) => u.id !== user.id);
    } else {
      newSelectedUsers = [...selectedUsers, user];
    }

    setSelectedUsers(newSelectedUsers);

    // Update react-hook-form state
    const updatedArray = newSelectedUsers.map((u) => ({
      name: u.name,
      amount: splitAmounts[u.id] || "0",
    }));
    setValue("splitWith", updatedArray);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Split with</Text>

      {/* Selected Users */}
      <View style={styles.selectedUsersContainer}>
        {selectedUsers.map((user) => (
          <View key={user.id} style={styles.splitItem}>
            <View style={styles.userIcon} />
            <Text style={styles.userName}>{user.name}</Text>
            <Controller
              control={control}
              render={({ field: { onChange } }) => (
                <TextInput
                  style={styles.amountInput}
                  value={splitAmounts[user.id]?.toString() || "0"}
                  onChangeText={(text) => {
                    const updatedSplits = { ...splitAmounts, [user.id]: text };
                    setSplitAmounts(updatedSplits);

                    // Update react-hook-form state
                    const updatedArray = selectedUsers.map((u) => ({
                      name: u.name,
                      amount: updatedSplits[u.id] || "0",
                    }));
                    setValue("splitWith", updatedArray);

                    onChange(text);
                  }}
                  keyboardType="numeric"
                />
              )}
              name={`splitAmount_${user.id}`} // Unique name for each user
              defaultValue={splitAmounts[user.id]?.toString() || "0"}
            />
          </View>
        ))}
      </View>

      {/* Add People Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add People</Text>
      </TouchableOpacity>

      {/* Paid By Selection */}
      <View style={styles.paidByContainer}>
        <Text style={styles.paidByText}>Paid by</Text>
        <TouchableOpacity style={styles.paidByButton} onPress={() => setPaidByModalVisible(true)}>
          <Text style={styles.paidByButtonText}>{paidBy.name}</Text>
        </TouchableOpacity>
      </View>

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
                  <Text style={[styles.modalItemText]}>{item.name}</Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color="black" />}
                </TouchableOpacity>
              );
            }}
          />
          <CustomButton onPress={() => setModalVisible(false)}>Done</CustomButton>
        </View>
      </Modal>

      {/* Paid By Selection Modal */}
      <Modal animationType="slide" transparent={false} visible={paidByModalVisible} onRequestClose={() => setPaidByModalVisible(false)}>
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTitle}>Select Payer</Text>
          <FlatList
            data={staticUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = paidBy.id === item.id;
              return (
                <TouchableOpacity onPress={() => { setPaidBy(item); setPaidByModalVisible(false); }} style={[styles.modalItem, isSelected && styles.selectedItem]}>
                  <Text style={[styles.modalItemText]}>{item.name}</Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color="black" />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SplitWithSelector;


const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    //  rgba(30, 42, 71, 0.9)
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
  amountInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: 60,
    textAlign: "right",
    color: "#000",
    fontSize: 18,
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
  paidByContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    alignSelf: "center",
  },
  paidByText: {
    fontSize: 16,
    color: "#000",
  },
  paidByButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  paidByButtonText: {
    color: "#FFF",
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
    // padding: 6,
    paddingInline: 6,
    borderRadius: 5
    // borderBottomWidth: 1,
    // borderBottomColor: "#555",
  },
  modalItemText: {
    color: "#000",
    fontSize: 18,
  },
  selectedItem: {
    // fontWeight: "bold",
    backgroundColor: "rgba(111, 187, 250, 0.24)"

    // color: "#4CAF50",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#000",
    fontSize: 20,
  },
});