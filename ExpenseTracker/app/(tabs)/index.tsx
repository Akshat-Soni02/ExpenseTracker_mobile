import { StyleSheet ,ScrollView,View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, StatusBar,Pressable} from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
// import {  View } from '@/components/Themed';
import { useRouter } from "expo-router";
import ImageIcon from '@/components/ImageIcon';
import * as React from 'react';
// import { Card, Text } from 'react-native-paper';
import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Divider, PaperProvider, Portal, Modal} from 'react-native-paper';
import TransactionCard from '@/components/TransactionCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useGetUserCurrentExchangeStatusQuery, useGetUserDetectedTransactionsQuery,useGetUserGroupsQuery,useGetUserQuery } from '@/store/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Make sure to install this


const transactions = [
  { id: "1", title:"Paytmqr28100743...",imageType: "expense", amount: "₹60", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
  { id: "2",title:"Paytmqr28100743...", imageType: "income", amount: "₹90", time: "6:16 pm · 19 Feb" ,transactionType: "income"},
  { id: "3", title:"Paytmqr28100743...",imageType: "expense", amount: "₹80", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
];

// const groups = [{id:"1",group_title:"AnyGroupA"}, {id:"2",group_title:"AnyGroupB"}, {id:"3",group_title:"AnyGroupC"}];

export default function HomeScreen() {
  const router = useRouter();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedTransaction, setSelectedTransaction] = React.useState(null);
  
  const { authToken, loading, logout } = useAuth();
  const [user, setUser] = useState();

  useEffect(() => {
    if (!loading && !authToken) {
      router.replace("/welcome");
    }
  }, [authToken, loading]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#ffffff');
  }, []);

  const {data: dataUser, isLoading: isLoadingUser, error: errorUser} = useGetUserQuery();
  const {data: exchangeData, isLoading, error} = useGetUserCurrentExchangeStatusQuery();
  const {data:dataDetected,isLoading:isLoadingDetected,error:errorDetected} = useGetUserDetectedTransactionsQuery({});
  

  const {data:dataGroup,isLoading:isLoadingGroup,error:errorGroup} = useGetUserGroupsQuery({});

  if (isLoadingDetected || isLoadingGroup || isLoadingUser || isLoading) {
    return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  }
  
  if (errorDetected || errorGroup || errorUser) {
    return <Text>Error: {errorDetected?.message || JSON.stringify(errorDetected) || errorGroup?.message || JSON.stringify(errorGroup) || errorUser?.message || JSON.stringify(errorUser)}</Text>;
  }
  const groups = dataGroup.data;
  const numberofGroups = groups.length;
  const numberOfTransactions = dataDetected.data.length;

  const openModal = (transaction:any) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };
  const handleSelection = (option:any) => {
    if (option === "to Split") {
      router.push({ pathname: "../addSplit", params: {detectedId: selectedTransaction?._id, detectedAmount: selectedTransaction?.amount,detectedTransaction_type: selectedTransaction?.transaction_type,detectedDescription:selectedTransaction?.description,detectedFrom_account:selectedTransaction?.from_account,detectedTo_account:selectedTransaction?.to_account,detectedCreated_at_date_time:selectedTransaction?.created_at_date_time, detectedNotes:selectedTransaction?.notes} });
    } else if (option === "to Personal") {
      router.push({ pathname: "../addTransaction", params: {detectedId: selectedTransaction?._id, detectedAmount: selectedTransaction?.amount,detectedTransaction_type:selectedTransaction?.transaction_type,detectedDescription:selectedTransaction?.description,detectedFrom_account:selectedTransaction?.from_account,detectedTo_account:selectedTransaction?.to_account,detectedCreated_at_date_time:selectedTransaction?.created_at_date_time, detectedNotes:selectedTransaction?.notes} });
    }
    setModalVisible(false);
  };
  return (
    <PaperProvider>
  <View style={styles.page}>
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileColumn1}>
          <TouchableOpacity style={styles.profileInfo} onPress={()=>router.push("../viewProfile")}>
            {dataUser.data.profile_photo ? (<Image source={{ uri: dataUser.data.profile_photo.url }} style={styles.avatar} />) : ( <LinearGradient colors={["#FFFFFF", "#F3F4F6"]} style={styles.avatar} />)}
            <View>
              <Text style={styles.greeting}>Good afternoon</Text>
              <Text style={styles.name}>{dataUser.data.name}</Text>
            </View>
          </TouchableOpacity>
        
          <View style={styles.totalSpend}>
            <View>
              <Text style={styles.label}>Today's spend</Text>
              <Text style={styles.spend}>₹0</Text>
            </View>
          </View>
        </View>
        <View style={styles.profileColumn2}>
          <View style={styles.financialSummary}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>You owe</Text>
              {!isLoading && (<Text style={styles.debit}>₹{exchangeData?.data?.borrowedAmount?.toFixed(2)}</Text>)}
            </View>
            <View>
              <Text style={styles.label}>You lended</Text>
              {!isLoading && (<Text style={styles.credit}>₹{exchangeData?.data?.lendedAmount?.toFixed(2)}</Text>)}
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
  {[
    { icon: "call-split", label: "New Split", route: "../addSplit" },
    { icon: "plus", label: "New Spend", route: "../addTransaction" },
    { icon: "file-check-outline", label: "Bills", route: "../activity/bills" },
    { icon: "finance", label: "Budgets", route: "/activity/budgets" },
  ].map((item, index) => (
    <View key={index} style={styles.actionContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push(item.route)}>
        <MaterialCommunityIcons name={item.icon} color="black" size={32} />
      </TouchableOpacity>
      <Text style={styles.actionText}>{item.label}</Text>
    </View>
  ))}
</View>


      {/* Transactions */}
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <Button style={styles.viewButton} onPress={()=>router.push("/activity/detectedTransactions")}>
          View all
        </Button>
      </View>
      {numberOfTransactions>0 ? (<FlatList
        data={dataDetected.data.slice(0,3)}
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
          <View style={{  height: 2, backgroundColor: 'white'}} />
        )}
        contentContainerStyle={{ paddingBottom: 0 }}  // Ensure no extra padding

      />) :
      <Text style={styles.noTransactionsText}>No transactions for today</Text>}
      

      {/* Groups */}
      <View style={styles.titleContainer}>
        <Text style={[styles.sectionTitle,{paddingTop:20}]} >Groups</Text>
        <Button style={styles.viewButton} onPress={()=>router.push("/activity/groups")}>
            View all
        </Button>
      </View>
      <View style={styles.groupContainer}>
        {groups.slice(0, 3).map((group:any, index:any = group._id) => (
          <TouchableOpacity onPress={() => router.push({ pathname: "../../viewGroup", params: { id:group._id} })}>
          <View key={index} style={styles.groupItem}>
            <Text style={styles.groupLetter}>{group.group_title.charAt(0)}</Text>
            <Text style={styles.groupName}>{group.group_title}</Text>
          </View>
          </TouchableOpacity>
        ))}
        <View style={styles.groupItem}>
          <TouchableOpacity style={styles.newGroup} onPress={() => router.push("../createGroup")}>
            <Ionicons name="add" size={24} color="#000" />          
          </TouchableOpacity>
          <Text style={styles.groupName}>Add</Text>
        </View>
      </View>
    </View>
    <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalView}>
            {/* <Text style={styles.modalText}>Choose an action</Text> */}
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
  page:{
    flex:1,
    backgroundColor: "#ffffff"
  },
  container: { 
    justifyContent:"space-between",
    padding: 20,      
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
  profileCard: { 
    flexDirection: "row", 
    justifyContent: "flex-start", 
    height:160,
    width:"100%",
    padding: 20, 
    borderRadius: 10, 
    backgroundColor: "#4A627A", 
    marginBottom: 20 
  },

  profileInfo: { 
    flexDirection: "row",  
  },
  profileColumn1: { 
    width:"50%",
    justifyContent:"space-between",
    // flexDirection: "row", 
  },
  profileColumn2:{
    width:"50%",
    justifyContent:"flex-end",
    // flexDirection: "column", 
  },
  textContainer:{
    marginBottom:10,
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 10, 
  },
  greeting: { 
    color: "#fff", 
    fontSize: 12,
  },
  name: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  financialSummary: { 
    alignSelf:"flex-end",
  },
  totalSpend: {
    alignItems: "flex-start",
  },
  label: { 
    color: "#ccc",
    fontSize: 14
  },
  debit: { 
    color: "red", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  credit: { 
    color: "#7DDE92", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  spend:{
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:20,
  },
  actionContainer: {
    alignItems: "center", // Centers the icon and text
  },
  actionButton: {
    padding: 10,
    backgroundColor: "#C8E6FF",
    borderRadius: 50,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: "#000",
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  transactionItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    backgroundColor: "#f8f9fa", 
    borderRadius: 10, 
    marginBottom: 10 
  },
  transactionDetails: { 
    flex: 1,
    marginLeft: 10 
  },
  transactionTitle: { 
    fontSize: 16 
  },
  transactionTime: { 
    color: "#888", 
    fontSize: 12 
  },
  transactionAmount: { 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  groupContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 5 ,
  },
  groupItem: { 
    alignItems: "center",
  },
  groupLetter: { 
    fontSize: 25, 
    fontWeight: "bold", 
    backgroundColor: "#D1E7FF",  
    width:55,
    height:55,
    borderRadius: 50 ,
    textAlign: "center",
    textAlignVertical: "center",
  },
  groupName: { 
    fontSize: 12, 
    marginTop: 5 
  },
  newGroup: { 
    backgroundColor: "#D1E7FF", 
    padding: 15, 
    borderRadius: 50, 
    alignItems: "center" 
  },
  titleContainer:{
    justifyContent:"space-between",
    flexDirection:"row"
  },
  viewButton:{
    alignSelf:"flex-end"
  }, 
  noTransactionsText: {
    height: 150, // Set a fixed height to match the expected space
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    textAlign: 'center', // Center the text
    fontSize: 16, // Adjust font size as needed
    color: 'gray', // Change color to indicate no transactions
    padding: 16, // Add some padding for better spacing
    textAlignVertical: "center"
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
  backgroundColor: "#a94442", // Red for cancel to indicate action
},
buttonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
},
});