import { StyleSheet, Image,ScrollView ,FlatList} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { MaterialCommunityIcons,FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SegmentedButtons,FAB } from 'react-native-paper';
import * as React from 'react';
import {useGetUserBillsQuery} from '@/store/userApi';
import { format } from "date-fns";

const transactions = [
  { id: "1", title:"Dinner",imageType: undefined, amount: "₹60", time: "due date: 6pm, 20Feb" ,transactionType: undefined},
  { id: "2",title:"Party", imageType: undefined, amount: "₹90", time: "due date: 6pm, 20Feb" ,transactionType: undefined},
  { id: "3", title:"Travel",imageType: undefined, amount: "₹80", time: "due date: 6pm, 20Feb" ,transactionType: undefined},
];
// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";
export default function BillsScreen() {
  const router = useRouter();

  const [value, setValue] = React.useState('');

  const {data: dataPendingBills, isLoading: isLoadingPendingBills, error: errorPendingBills} = useGetUserBillsQuery({ status: "pending" });
  if (isLoadingPendingBills) {
      return <Text>Loading...</Text>;
  }
    
  if (errorPendingBills) {
      return <Text>Error: {errorPendingBills?.message || JSON.stringify(errorPendingBills)}</Text>;
  }
  
  const pendingBills = dataPendingBills.data;
  const numberOfPendingBills = pendingBills.length;
  return (
    <View style={styles.screen}>
        <ScrollView style={styles.container}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>      
          <Text style={styles.headerText}>All Bills</Text>
          <View style={styles.navbar}>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: 'pending',
                  label: 'Pending',
                  checkedColor:"red",
                  uncheckedColor:"black",
                },
                {
                  value: 'missed',
                  label: 'Missed',
                  onPress: ()=>router.push("../activity/missedBills"),

                  checkedColor:"red",
                  uncheckedColor:"black",
                },
                { 
                  value: 'completed', 
                  label: 'Completed',
                  onPress: ()=>router.push("../activity/completedBills"),

                  checkedColor:"red",
                  uncheckedColor:"black",

                },
              ]}
            />
          </View>

          {numberOfPendingBills>0?(<FlatList
            data={pendingBills}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TransactionCard
              pressFunction = {() => router.push({ pathname: "../../viewBill", params: { id:item._id} })} 
              title = {item.bill_title}
              imageType = {undefined}
              amount={`₹${item.amount}`}
              subtitle={`Due date: ${format(new Date(item.due_date_time), "MMMM dd, yyyy")}`}
              transactionType={undefined}
              />
              
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 15, backgroundColor: 'white'}} />
            )}
            contentContainerStyle={{ paddingBottom: 0 }}  // Ensure no extra padding

          />):
            <Text style={styles.noPendingBillsText}>No Pending Bills!</Text>
          }
          
        </ScrollView>
        <FAB
            label="Add Bill"
            style={styles.fab}
            onPress={() => router.push("../../createBill")}
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
  backButton: {
    // position: "absolute",
    left: 10,
    top: 20, // Space above the back button
    marginBottom: 20, // Space below the back button
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
noPendingBillsText: {
  height: 100, // Set a fixed height to match the expected space
  justifyContent: 'center', // Center the text vertically
  alignItems: 'center', // Center the text horizontally
  textAlign: 'center', // Center the text
  fontSize: 16, // Adjust font size as needed
  color: 'gray', // Change color to indicate no transactions
  padding: 16, // Add some padding for better spacing
},
});