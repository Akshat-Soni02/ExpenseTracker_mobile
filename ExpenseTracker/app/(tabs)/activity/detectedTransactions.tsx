import { StyleSheet,ScrollView ,FlatList,Pressable} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Modal,Portal } from 'react-native-paper';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 
import {useGetUserDetectedTransactionsQuery} from '@/store/userApi'; 

export default function DetectedTransactionsScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState(null);
  const [value, setValue] = React.useState('');
  const {data: dataDetected, isLoading: isLoadingDetected, error: errorDetected} = useGetUserDetectedTransactionsQuery({});
  
  if (isLoadingDetected) {
    return <Text>Loading...</Text>;
  }
  if (errorDetected) {
    return <Text>Error: {errorDetected?.message || JSON.stringify(errorDetected)}</Text>;
  }

  const detectedTransactions = dataDetected.data;
  const numberOfDetectedTransactions = detectedTransactions.length; 

  const openModal = (transaction:any) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };
  //credit debit, 
  const handleSelection = (option:any) => {
    if (option === "to Split") {
      router.push({ pathname: "/action/create/createExpense", params: {detectedId: selectedTransaction?._id, detectedAmount: selectedTransaction?.amount,detectedTransaction_type: selectedTransaction?.transaction_type,detectedDescription:selectedTransaction?.description,detectedFrom_account:selectedTransaction?.from_account,detectedTo_account:selectedTransaction?.to_account,detectedCreated_at_date_time:selectedTransaction?.created_at_date_time, detectedNotes:selectedTransaction?.notes} });
    } else if (option === "to Personal") {
      router.push({ pathname: "/action/create/createTransaction", params: {detectedId: selectedTransaction?._id, detectedAmount: selectedTransaction?.amount,detectedTransaction_type:selectedTransaction?.transaction_type,detectedDescription:selectedTransaction?.description,detectedFrom_account:selectedTransaction?.from_account,detectedTo_account:selectedTransaction?.to_account,detectedCreated_at_date_time:selectedTransaction?.created_at_date_time, detectedNotes:selectedTransaction?.notes} });
    }
    setModalVisible(false);
  };

  return (
    <PaperProvider>
    <View style={globalStyles.screen}>
      
        <ScrollView style={globalStyles.viewContainer}>
          <View style = {globalStyles.viewHeader}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={globalStyles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>      
          <Text style={globalStyles.headerText}>All detected transactions</Text>
          </View>

          {numberOfDetectedTransactions>0 ?(<FlatList
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

          />)
          :
          <Text style= {globalStyles.noText}>No transactions detected</Text>
          }
          
        </ScrollView>
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>Choose an action</Text>
              <Icon name="close" size={24} color="#333" onPress={() => setModalVisible(false)} style={{justifyContent: "flex-start"}}/>
            </View>
            {selectedTransaction?.transaction_type.toString()==="debit" &&<Pressable style={styles.button} onPress={() => handleSelection("to Split")}>
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
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
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
      backgroundColor: "#475569",
      borderRadius: 10,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: "#b52b27",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
});