import { StyleSheet,ScrollView ,FlatList,Pressable, ActivityIndicator} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Modal,Portal } from 'react-native-paper';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserDetectedTransactionsQuery} from '@/store/userApi';
import { globalStyles } from "@/styles/globalStyles";
import { Detected } from "@/store/detectedTransactionApi";

export default function DetectedTransactionsScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Detected | null>(null);
  
  const {data: dataDetected, isLoading: isLoadingDetected, error: errorDetected} = useGetUserDetectedTransactionsQuery();

  if (isLoadingDetected) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
    
  if (errorDetected) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorDetected) {
      errorMessage = `Server Error: ${JSON.stringify(errorDetected.data)}`;
    } else if ("message" in errorDetected) {
      errorMessage = `Client Error: ${errorDetected.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  const detectedTransactions: Detected[] = dataDetected?.data || [];
  const numberOfDetectedTransactions: number = detectedTransactions.length; 

  const openModal = (transaction: Detected) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  //credit debit 
  const handleSelection = (option: "to Split" | "to Personal") => {
    if (option === "to Split") {
      router.push({ pathname: "/action/create/createExpense", params: {detectedId: selectedTransaction?._id, detectedAmount: selectedTransaction?.amount,detectedTransaction_type: selectedTransaction?.transaction_type,detectedDescription:selectedTransaction?.description,detectedFrom_account:selectedTransaction?.from_account,detectedTo_account:selectedTransaction?.to_account,detectedCreated_at_date_time:selectedTransaction?.created_at_date_time, detectedNotes:selectedTransaction?.notes} });
    } else if (option === "to Personal") {
      router.push({ pathname: "/action/create/createTransaction", params: {detectedId: selectedTransaction?._id, detectedAmount: selectedTransaction?.amount,detectedTransaction_type:selectedTransaction?.transaction_type,detectedDescription:selectedTransaction?.description,detectedFrom_account:selectedTransaction?.from_account,detectedTo_account:selectedTransaction?.to_account,detectedCreated_at_date_time:selectedTransaction?.created_at_date_time, detectedNotes:selectedTransaction?.notes} });
    }
    setModalVisible(false);
  };

  return (
    <PaperProvider>
    <View style={styles.screen}>
      
        <ScrollView style={styles.container}>
          
          <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>      
          <Text style={styles.headerText}>Transactions</Text>
          
          {numberOfDetectedTransactions>0 ? (
            <FlatList
            data={detectedTransactions}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <TransactionCard 
                pressFunction = {() => openModal(item)}
                title = {item.description}
                imageType = {item.transaction_type}
                amount={`₹${item.amount}`}
                subtitle={item.created_at_date_time}
                transactionType={item.transaction_type}
                />
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 5, backgroundColor: 'white'}} />
            )}
            contentContainerStyle={{ paddingBottom: 5 }}
            />) : <Text style= {styles.noWalletsText}>No transactions</Text>}
          
        </ScrollView>

        <Portal>

          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>Choose an action</Text>
              <Icon name="close" size={24} color="#333" onPress={() => setModalVisible(false)} style={{justifyContent: "flex-start"}}/>
            </View>

            {selectedTransaction?.transaction_type.toString()==="debit" &&
              <Pressable style={styles.button} onPress={() => handleSelection("to Split")}>
                <Text style={styles.buttonText}>Convert to split</Text>
              </Pressable>
            }

            <Pressable style={styles.button} onPress={() => handleSelection("to Personal")}>
              <Text style={styles.buttonText}>Convert to spend</Text>
            </Pressable>
          </Modal>

        </Portal>

    </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
    screen:{
        flex:1
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      // alignItems: "center",
      // paddingHorizontal: 16,
      paddingLeft: 16,
      // paddingVertical: 10,
      width: "100%",
      // backgroundColor: "red",
    },
  container: {
    flex: 1,
    position:"relative",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 0, // Add padding to the top to avoid overlap with status bar
  },
  backButton: {
    // position: "absolute",
    left: 10,
    top: 20, // Space above the back button
    marginBottom: 60, // Space below the back button
  },
  headerText: {
    position: "absolute",
    top: 20, // Space above the header text
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
  todayText: {
    // marginTop: 1 // Space above the "Today" text
    marginLeft: 20,
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 0, // Space below the "Today" text
  },
  transactionsContainer: {
    // marginTop: 10, // Space above the transactions
    alignItems: "flex-start",
    width: "100%",
    paddingVertical: 10, // Space above and below the transactions
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  fab: {
    position: "absolute",
    margin: 16,
    backgroundColor:"#f8f9fa",
    right: 0,
    bottom: 0,
},
noWalletsText: {
  height: 100, // Set a fixed height to match the expected space
  justifyContent: 'center', // Center the text vertically
  alignItems: 'center', // Center the text horizontally
  textAlign: 'center', // Center the text
  fontSize: 16, // Adjust font size as needed
  color: 'gray', // Change color to indicate no transactions
  padding: 16, // Add some padding for better spacing
},
modalView: {
  position: "absolute",
  top: "50%", // Position in the middle of the screen
  left: "50%", // Position in the middle horizontally
  transform: [{ translateX: -150 }, { translateY: -100 }], // Shift back by half width/height
  width: 300, // Fixed width to avoid stretching
  backgroundColor: "white",
  padding: 25,
  borderRadius: 15,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 6,
},
modalContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for better focus
},

modalText: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 15,
  textAlign: "center",
},
button: {
  width: "100%",
  padding: 14,
  marginVertical: 8,
  backgroundColor: "#475569",
  borderRadius: 10,
  alignItems: "center",
},
cancelButton: {
  backgroundColor: "#b52b27", // Red for cancel to indicate action
},
buttonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
},
});