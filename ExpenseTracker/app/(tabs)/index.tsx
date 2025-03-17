import { StyleSheet ,ScrollView,View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
// import {  View } from '@/components/Themed';
import { useRouter } from "expo-router";
import ImageIcon from '@/components/ImageIcon';
import * as React from 'react';
// import { Card, Text } from 'react-native-paper';
import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Divider} from 'react-native-paper';
import TransactionCard from '@/components/TransactionCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useGetUserDetectedTransactionsQuery,useGetUserGroupsQuery,useGetUserQuery } from '@/store/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useState } from 'react';
const transactions = [
  { id: "1", title:"Paytmqr28100743...",imageType: "expense", amount: "₹60", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
  { id: "2",title:"Paytmqr28100743...", imageType: "income", amount: "₹90", time: "6:16 pm · 19 Feb" ,transactionType: "income"},
  { id: "3", title:"Paytmqr28100743...",imageType: "expense", amount: "₹80", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
];

// const groups = [{id:"1",group_title:"AnyGroupA"}, {id:"2",group_title:"AnyGroupB"}, {id:"3",group_title:"AnyGroupC"}];

export default function HomeScreen() {
  const router = useRouter();

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const {data: dataUser, isLoading: isLoadingUser, error: errorUser} = useGetUserQuery({});
  const {data:dataDetected,isLoading:isLoadingDetected,error:errorDetected} = useGetUserDetectedTransactionsQuery({});
  

  const {data:dataGroup,isLoading:isLoadingGroup,error:errorGroup} = useGetUserGroupsQuery({});
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const storedUser = await AsyncStorage.getItem("user");
  //       console.log("ASFDASDFASDFASDFASDF-------",storedUser);
  //       if (storedUser) {
  //         const parsedUser = JSON.parse(storedUser); // Parse the JSON object
  //         console.log("ppppppp------",parsedUser);
  //         setUser(parsedUser); // Set the user object
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  if (isLoadingDetected || isLoadingGroup || isLoadingUser) {
    return <Text>Loading...</Text>;
  }
  
  if (errorDetected || errorGroup || errorUser) {
    return <Text>Error: {errorDetected?.message || JSON.stringify(errorDetected) || errorGroup?.message || JSON.stringify(errorGroup) || errorUser?.message || JSON.stringify(errorUser)}</Text>;
  }
  console.log("Hereeeeeeeee      ",dataUser);
  const groups = dataGroup.data;
  const numberofGroups = groups.length;
  console.log(dataDetected.data.slice(0,3).length);
  const numberOfTransactions = dataDetected.data.length;
  console.log(numberOfTransactions);
  return (
  <View style={styles.page}>
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileColumn1}>
          <TouchableOpacity style={styles.profileInfo} onPress={()=>router.push("../viewProfile")}>
            <Image
              source={require("../../assets/images/sampleprofilepic.png")}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Good afternoon</Text>
              <Text style={styles.name}>{dataUser.data.name}</Text>
            </View>
          </TouchableOpacity>
        
          <View style={styles.totalSpend}>
            <View>
              <Text style={styles.label}>Today's Spend</Text>
              <Text style={styles.spend}>₹5000</Text>
            </View>
          </View>
        </View>
        <View style={styles.profileColumn2}>
          <View style={styles.financialSummary}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>You owe</Text>
              <Text style={styles.debit}>₹500</Text>
            </View>
            <View>
              <Text style={styles.label}>You lended</Text>
              <Text style={styles.credit}>₹1000</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
  {[
    { icon: "plus", label: "New Split", route: "../addSplit" },
    { icon: "receipt", label: "Bills", route: "../activity/pendingBills" },
    { icon: "plus", label: "New Spend", route: "../addTransaction" },
    { icon: "piggy-bank", label: "Budgets", route: "/activity/budgets" },
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
          title = {item.description}
          imageType = {item.transaction_type}
          amount={`₹${item.amount}`}
          subtitle={item.created_at_date_time}
          transactionType={item.transaction_type}
          />
          
        )}
        ItemSeparatorComponent={() => (
          <View style={{  height: 2, backgroundColor: 'black'}} />
        )}
        contentContainerStyle={{ paddingBottom: 0 }}  // Ensure no extra padding

      />) :
      <Text style={styles.noTransactionsText}>No Transactions for Today</Text>}
      

      {/* Groups */}
      <View style={styles.titleContainer}>
        <Text style={[styles.sectionTitle,{paddingTop:30}]} >Groups</Text>
        <Button style={styles.viewButton} onPress={()=>router.push("/activity/groups")}>
            View all
        </Button>
      </View>
      <View style={styles.groupContainer}>
        {groups.map((group:any, index:any) => (
          <View key={index} style={styles.groupItem}>
            <Text style={styles.groupLetter}>{group.group_title.charAt(0)}</Text>
            <Text style={styles.groupName}>{group.group_title}</Text>
          </View>
        ))}
        <View style={styles.groupItem}>
          <TouchableOpacity style={styles.newGroup}>
            <Ionicons name="add" size={24} color="#000" />          
          </TouchableOpacity>
          <Text style={styles.groupName}>Add</Text>
        </View>
      </View>
    </View>
  </View>
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
  profileCard: { 
    flexDirection: "row", 
    justifyContent: "flex-start", 
    height:180,
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
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom:30,
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
    justifyContent: "flex-start", 
    marginTop: 10 ,
  },
  groupItem: { 
    alignItems: "center",
    marginRight:40,
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
    height: 100, // Set a fixed height to match the expected space
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    textAlign: 'center', // Center the text
    fontSize: 16, // Adjust font size as needed
    color: 'gray', // Change color to indicate no transactions
    padding: 16, // Add some padding for better spacing
},
});