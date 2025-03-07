import { StyleSheet, Image,ScrollView ,FlatList,TextInput,Button} from "react-native";
import { Text, View } from "@/components/Themed";
import { router, useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { MaterialCommunityIcons,FontAwesome,FontAwesome5,Ionicons,MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SegmentedButtons } from 'react-native-paper';
import * as React from 'react';
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const transactions = [
  { id: "1", title:"Dinner",imageType: "expense", amount: "₹60", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
  { id: "2",title:"Party", imageType: "expense", amount: "₹90", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
  { id: "3", title:"Travel",imageType: "expense", amount: "₹80", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
];
// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";
// export default function AddSplitScreen() {
//   const router = useRouter();

//   const [value, setValue] = React.useState('');
//   const people = ["Alice", "Bob", "Charlie", "David"];
//   const groups = ["Trip 2024", "House Rent", "Office Lunch"];
//   const wallets = ["Credit Card", "Cash", "UPI"];

//   // State variables
//   const [description, setDescription] = useState("");
//   const [selectedLenders, setSelectedLenders] = useState<string[]>([]);
//   const [selectedBorrowers, setSelectedBorrowers] = useState<string[]>([]);
//   const [group, setGroup] = useState(groups[0]);
//   const [wallet, setWallet] = useState(wallets[0]);
//   const [image, setImage] = useState<string | null>(null);
//   const [totalAmount, setTotalAmount] = useState("");
//   const [expenseCategory, setExpenseCategory] = useState("Food");
//   const [notes, setNotes] = useState("");
//   const [splitAmounts, setSplitAmounts] = useState<{ [key: string]: string }>({});

//   // Pick image
// //   const pickImage = async () => {
// //     let result = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       allowsEditing: true,
// //       aspect: [4, 3],
// //       quality: 1,
// //     });

// //     if (!result.canceled) {
// //       setImage(result.assets[0].uri);
// //     }
// //   };

//   // Handle lender/borrower selection
// //   const toggleSelection = (person: string, list: string[], setList: Function) => {
// //     setList(list.includes(person) ? list.filter((p) => p !== person) : [...list, person]);
// //   };

//   // Auto-split amount
// //   const splitAmountEvenly = () => {
// //     const total = parseFloat(totalAmount);
// //     if (!total || selectedBorrowers.length === 0) return;
// //     const splitValue = (total / selectedBorrowers.length).toFixed(2);
// //     const newSplits = Object.fromEntries(selectedBorrowers.map((person) => [person, splitValue]));
// //     setSplitAmounts(newSplits);
// //   };
//   return (
//         <ScrollView style={styles.container}>
          
//           <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//             <FontAwesome name="arrow-left" size={20} color="black" />
//           </TouchableOpacity>      
//           <Text style={styles.headerText}>All Records</Text>
//           <View style={styles.navbar}>
//             <SegmentedButtons
//               value={value}
//               onValueChange={setValue}
//               buttons={[
//                 {
//                   value: 'expense',
//                   label: 'Expenses',
//                   checkedColor:"red",
//                   uncheckedColor:"black",
//                 },
//                 {
//                   value: 'transaction',
//                   label: 'Transactions',
//                   onPress: ()=>router.push("/activity/activityTransaction"),

//                   checkedColor:"red",
//                   uncheckedColor:"black",
//                 },
//               ]}
//             />
//           </View>
//         <Text style={styles.label}>Description:</Text>
//       <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Enter expense description" />

//       <Text style={styles.label}>Lenders:</Text>
//       <FlatList
//         data={people}
//         keyExtractor={(item) => item}
//         horizontal
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[styles.chip, selectedLenders.includes(item) && styles.selectedChip]}
//             onPress={() => toggleSelection(item, selectedLenders, setSelectedLenders)}
//           >
//             <Text style={[styles.chipText, selectedLenders.includes(item) && styles.selectedText]}>{item}</Text>
//           </TouchableOpacity>
//         )}
//       />

//       <Text style={styles.label}>Borrowers:</Text>
//       <FlatList
//         data={people}
//         keyExtractor={(item) => item}
//         horizontal
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[styles.chip, selectedBorrowers.includes(item) && styles.selectedChip]}
//             onPress={() => toggleSelection(item, selectedBorrowers, setSelectedBorrowers)}
//           >
//             <Text style={[styles.chipText, selectedBorrowers.includes(item) && styles.selectedText]}>{item}</Text>
//           </TouchableOpacity>
//         )}
//       />

//       <Text style={styles.label}>Group:</Text>
//       <Picker selectedValue={group} onValueChange={(value) => setGroup(value)} style={styles.picker}>
//         {groups.map((g) => (
//           <Picker.Item key={g} label={g} value={g} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Wallet:</Text>
//       <Picker selectedValue={wallet} onValueChange={(value) => setWallet(value)} style={styles.picker}>
//         {wallets.map((w) => (
//           <Picker.Item key={w} label={w} value={w} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Total Amount:</Text>
//       <TextInput style={styles.input} keyboardType="numeric" value={totalAmount} onChangeText={setTotalAmount} onEndEditing={splitAmountEvenly} placeholder="Enter total amount" />

//       <Text style={styles.label}>Expense Category:</Text>
//       <TextInput style={styles.input} value={expenseCategory} onChangeText={setExpenseCategory} placeholder="Enter category" />

//       <Text style={styles.label}>Notes:</Text>
//       <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Add optional notes" /> */}

//       {/* <Button title="Upload Photo" onPress={pickImage} />
//       {image && <Image source={{ uri: image }} style={styles.image} />} */}
//         </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 10,
//     backgroundColor: "#fff",
//     paddingTop: 0, // Add padding to the top to avoid overlap with status bar
//   },
//   backButton: {
//     // position: "absolute",
//     left: 10,
//     top: 20, // Space above the back button
//     marginBottom: 20, // Space below the back button
//   },
//   headerText: {
//     position: "absolute",
//     top: 20, // Space above the header text
//     fontSize: 22,
//     right: 10,
//     fontWeight: "bold",
//     marginBottom: 20, // Space below the header text
//   },
//   navbar: {
//     // position: 'absolute',
//     // flexDirection: 'row',
//     // justifyContent: 'space-around',
//     // alignItems: 'center',
//     // height: 10,
//     marginBottom: 20, // Space below the navbar
//     backgroundColor: '#f8f8f8',
//     // borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     borderRadius: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     marginTop: 25, // Space above the navbar
//     shadowRadius: 2,
//     left : 2,
//   },
//   navItem: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   navText: {
//     color: 'black',
//     fontSize: 16,
//     fontWeight: '400',
//   },
//   todayText: {
//     // marginTop: 1 // Space above the "Today" text
//     marginLeft: 20,
//     color: "black",
//     fontSize: 20,
//     fontWeight: "bold",
//     // marginBottom: 0, // Space below the "Today" text
//   },
//   transactionsContainer: {
//     // marginTop: 10, // Space above the transactions
//     alignItems: "flex-start",
//     width: "100%",
//     paddingVertical: 10, // Space above and below the transactions
//   },

//   sectionTitle: { 
//     fontSize: 18, 
//     fontWeight: "bold", 
//     marginBottom: 10 
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#D1D1D1",
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: "#FFF",
//     marginBottom: 10,
//   },
//   picker: {
//     backgroundColor: "#FFF",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   chip: {
//     backgroundColor: "#E0E0E0",
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   selectedChip: {
//     backgroundColor: "#3A5AFF",
//   },
//   chipText: {
//     color: "#000",
//   },
//   selectedText: {
//     color: "#FFF",
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     marginTop: 10,
//   },
// });

export default function CreateExpense() {
  //   const [open, setOpen] = useState(false);
  //   const [selectedUsers, setSelectedUsers] = useState<{ label: string; value: string }[]>([]);
  //   const [amounts, setAmounts] = useState<{ [key: string]: string }>({});

  //   const [users, setUsers] = useState([
  //   { label: 'Alice', value: 'alice' },
  //   { label: 'Bob', value: 'bob' },
  //   { label: 'Charlie', value: 'charlie' },
  // ]);
  // const [splitMethod, setSplitMethod] = useState<'equally' | 'custom'>('equally');

  //   const [value, setValue] = React.useState('');
  //   const [description, setDescription] = useState('');
  //   const router = useRouter();
  //   const toggleUserSelection = (name: string) => {
  //       setSelectedUsers((prev) => {
  //         const exists = prev.find((u) => u.name === name);
  //         return exists
  //           ? prev.filter((u) => u.name !== name) // Remove if already selected
  //           : [...prev, { name, amount: '' }]; // Add with empty amount
  //       });
  //     };
    
  //     // Update amount for a user
  //     const updateUserAmount = (name: string, amount: string) => {
  //       setSelectedUsers((prev) =>
  //         prev.map((u) => (u.name === name ? { ...u, amount } : u))
  //       );
  //     }; 
  //   return (
  //     <View style={styles.container}>
  //       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
  //            <FontAwesome name="arrow-left" size={20} color="black" />
  //          </TouchableOpacity>   
  //          <TouchableOpacity onPress={() => router.back()} style={styles.headerText}>
  //            <FontAwesome name="check" size={30} color="black" />
  //          </TouchableOpacity>        
  //          {/* <Ionicons name="checkmark" size={24} color="white" /> */}

  //          <View style={styles.navbar}>
  //            <SegmentedButtons
  //              value={value}
  //              onValueChange={setValue}
  //              buttons={[
  //                {
  //                  value: 'expense',
  //                  label: 'Expenses',
  //                  checkedColor:"red",
  //                  uncheckedColor:"black",
  //                },
  //                {
  //                  value: 'transaction',
  //                  label: 'Transactions',
  //                  onPress: ()=>router.push("/activity/activityTransaction"),

  //                  checkedColor:"red",
  //                  uncheckedColor:"black",
  //                },
  //              ]}
  //            />
  //          </View>
  
  //       {/* Participants */}
  //       <Text style={styles.label}>With you and:</Text>
  //       {/* <TextInput
  //         style={styles.input}
  //         placeholder="Enter names, emails, or select"
  //         placeholderTextColor="#888"
  //       /> */}
  //       <DropDownPicker
  //       open={open}
  //       setOpen={setOpen}
  //       value={selectedUsers}
  //       setValue={setSelectedUsers}
  //       items={users}
  //       setItems={setUsers}
  //       placeholder="Select people"
  //       multiple={true}  // Allows multi-selection
  //       mode="BADGE"     // Shows selected values as badges
  //       style={styles.dropdown}
  //     />
  
  //       {/* Description & Amount */}
  //       <View style={styles.inputRow}>
  //         <MaterialIcons name="receipt" size={25} color="#888" />
  //         <TextInput
  //           style={[styles.input, styles.descriptionInput]}
  //           placeholder="Enter a description"
  //           placeholderTextColor="#888"
  //           value={description}
  //           onChangeText={setDescription}
  //         />
  //       </View>
  
  //       <View style={styles.inputRow}>
  //         <FontAwesome5 name="dollar-sign" size={25} color="#888" />
  //         <TextInput
  //           style={styles.amountInput}
  //           placeholder="0.00"
  //           placeholderTextColor="#888"
  //           keyboardType="numeric"
  //           value={amount}
  //           onChangeText={setAmount}
  //         />
  //       </View>
  
  //       {/* Payment Split */}
  //       <View style={styles.splitRow}>
  //         <Text style={styles.label}>Paid by</Text>
  //         <TouchableOpacity style={styles.pillButton}><Text style={styles.pillText}>You</Text></TouchableOpacity>
  //         <Text style={styles.label}>and split</Text>
  //         <TouchableOpacity style={styles.pillButton}><Text style={styles.pillText}>Equally</Text></TouchableOpacity>
  //       </View>
  
  // {/* Split Selection */}
  // <View style={styles.splitRow}>
  //       <Text style={styles.label}>Paid by</Text>
  //       <TouchableOpacity style={styles.pillButton}>
  //         <Text style={styles.pillText}>You</Text>
  //       </TouchableOpacity>
  //       <Text style={styles.label}>and split</Text>
  //       <TouchableOpacity
  //         style={styles.pillButton}
  //         onPress={() => setSplitMethod(splitMethod === 'equally' ? 'custom' : 'equally')}>
  //         <Text style={styles.pillText}>{splitMethod === 'equally' ? 'Equally' : 'Custom'}</Text>
  //       </TouchableOpacity>
  //     </View>
      
  //       {/* Bottom Action Bar */}
  //       <View style={styles.bottomBar}>
  //         <TouchableOpacity><FontAwesome5 name="users" size={24} color="#FFA500" /></TouchableOpacity>
  //         <TouchableOpacity><FontAwesome5 name="calendar-alt" size={24} color="#00A2FF" /></TouchableOpacity>
  //         <TouchableOpacity><FontAwesome5 name="camera" size={24} color="#8A2BE2" /></TouchableOpacity>
  //         <TouchableOpacity><FontAwesome5 name="pen" size={24} color="#00FF7F" /></TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    label: { color: 'black', fontSize: 16, marginBottom: 5 },
    input: { flex: 1, color: 'black,masdf,masdmf,nasdmfam,sdf', borderBottomWidth: 1, borderBottomColor: '#444', paddingVertical: 5, fontSize:20},
    descriptionInput: { marginLeft: 10,backgroundColor:"#f8f9fa" },
    inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30,backgroundColor:"#f8f9fa"},
    amountInput: { color: 'black', fontSize: 24, borderBottomWidth: 1, borderBottomColor: '#444', flex: 1, marginLeft: 10 },
    splitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15,backgroundColor:"#f8f9fa" },
    pillButton: { backgroundColor: '#222', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, marginHorizontal: 5 },
    pillText: { color: 'white' },
    bottomBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#333', marginTop: 20 },
    headerText: {
            position: "absolute",
            top: 30, // Space above the header text
            fontSize: 22,
            right: 10,
            fontWeight: "bold",
            marginBottom: 20, // Space below the header text
    },
    navbar: {
        // position: 'absolute',
        // flexDirection: 'row',
        // justifyContent: 'space-around',
        // alignItems: 'center',
        // height: 10,
        marginBottom: 20, // Space below the navbar
        backgroundColor: '#f8f8f8',
        // borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        marginTop: 25, // Space above the navbar
        shadowRadius: 2,
        left : 2,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
        navText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '400',
    },
    backButton: {
        // position: "absolute",
        left: 10,
        top: 20, // Space above the back button
        marginBottom: 20, // Space below the back button
    },
    dropdown: {
        backgroundColor: '#f8f9fa',
        borderColor: '#555',
        marginBottom:15,
    },
  });
  