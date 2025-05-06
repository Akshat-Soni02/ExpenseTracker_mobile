import { StyleSheet,ScrollView ,FlatList,Pressable, ActivityIndicator} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Modal,Portal } from 'react-native-paper';
import * as React from 'react';

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
    <View style={globalStyles.screen}>
      
        <ScrollView style={globalStyles.viewContainer}>
          <View style = {[globalStyles.viewHeader,{marginBottom: 15}]}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={globalStyles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>      
          <Text style={globalStyles.headerText}>Auto Transactions</Text>
          </View>
          
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
            />) : <Text style= {globalStyles.noText}>No auto transactions</Text>}
          
        </ScrollView>

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalView}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>Convert Auto Transaction</Text>
              {/* <Icon name="close" size={24} color="#333" onPress={() => setModalVisible(false)} style={{justifyContent: "flex-start"}}/> */}
            </View>

            {selectedTransaction?.transaction_type.toString()==="debit" && <Pressable style={styles.button} onPress={() => handleSelection("to Split")}>
                <Text style={styles.buttonText}>Split</Text>
              </Pressable>
            } 

            <Pressable style={styles.button} onPress={() => handleSelection("to Personal")}>
              <Text style={styles.buttonText}>Transaction</Text>
            </Pressable>

          </Modal>
        </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
    modalHeader: {
      flexDirection: "row",
      justifyContent: "center",
      paddingLeft: 16,
      width: "100%",
    },
    modalView: {
      position: "absolute",
      top: "50%", 
      left: "50%", 
      transform: [{ translateX: -150 }, { translateY: -100 }], 
      width: 300, 
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
      backgroundColor: "rgba(0, 0, 0, 0.4)", 
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
      backgroundColor: "#f8f9fa",
      borderRadius: 10,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: "#b52b27",
    },
    buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "600",
    },
});