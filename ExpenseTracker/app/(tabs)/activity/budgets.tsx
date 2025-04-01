import { StyleSheet, Image,ScrollView ,FlatList, ActivityIndicator} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { MaterialCommunityIcons,FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SegmentedButtons,FAB } from 'react-native-paper';
import * as React from 'react';
import {useGetUserBudgetsQuery} from '@/store/userApi'; 
const transactions = [
  { id: "1", title:"General",imageType: undefined, amount: "₹60", time: "cash" ,transactionType: undefined},
  { id: "2",title:"Food", imageType: undefined, amount: "₹90", time: "Acc. 12314" ,transactionType: undefined},
  { id: "3", title:"Travel",imageType: undefined, amount: "₹80", time: "Acc. 65786" ,transactionType: undefined},
];
// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";
export default function BudgetsScreen() {
  const router = useRouter();

  const [value, setValue] = React.useState('');
const {data: dataBudget, isLoading: isLoadingBudget, error: errorBudget} = useGetUserBudgetsQuery({});
  if (isLoadingBudget) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
    
    if (errorBudget) {
      return <Text>Error: {errorBudget?.message || JSON.stringify(errorBudget)}</Text>;
    }
  const budgets = dataBudget.data;
  const numberOfBudgets = budgets.length; 
  return (
    <View style={styles.screen}>
        <ScrollView style={styles.container}>
          
          <View style = {styles.header}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style = {{backgroundColor: "white"}}/>     
            <Text style={styles.headerText}>Budgets</Text>
          </View>
          
          {/* <View style={styles.navbar}>
            <TouchableOpacity  style={styles.navItem}><Text style={styles.navText}>Detected Transactions</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/activity/activitySplit")}><Text style={styles.navText}>Split Expenses</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/activity/activitySpend")}><Text style={styles.navText}>Spend Records</Text></TouchableOpacity>
          </View> */}
          {numberOfBudgets>0?(<FlatList
            data={budgets}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              // <TouchableOpacity onPress={() => router.push({ pathname: "../../viewBudget", params: { id: item._id } })}>
              <TransactionCard 
              title = {item.budget_title}
              imageType = {undefined}
              amount={`₹${item.amount}`}
              subtitle={`Current Spend: ₹${item.current_spend}`}
              optionText={item.period}
              transactionType={undefined}
              pressFunction={() => router.push({ pathname: "/view/viewBudget", params: { id: item._id } })}
              />
              // </TouchableOpacity>
              
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 5, backgroundColor: 'white'}} />
            )}
            contentContainerStyle={{ paddingBottom: 5 }}  // Ensure no extra padding
            nestedScrollEnabled={true}
          />):
          <Text style={styles.noBudgetsText}>No budgets found</Text>
          }
          
        </ScrollView>
        <FAB
            label="Add Budget"
            style={styles.fab}
            onPress={() => router.push("/action/create/createBudget")}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    screen:{
        flex:1
    },
  container: {
    flex: 1,
    position:"relative",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 0, // Add padding to the top to avoid overlap with status bar
  },
  header: {
    color: "black",
    backgroundColor: "white",
    paddingInline: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black"
  },
  navbar: {
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#ddd',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    marginTop: 25,
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
},noBudgetsText: {
  height: 100, // Set a fixed height to match the expected space
  justifyContent: 'center', // Center the text vertically
  alignItems: 'center', // Center the text horizontally
  textAlign: 'center', // Center the text
  fontSize: 16, // Adjust font size as needed
  color: 'gray', // Change color to indicate no transactions
  padding: 16, // Add some padding for better spacing
},
});