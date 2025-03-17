import { StyleSheet, Image,ScrollView ,FlatList} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { MaterialCommunityIcons,FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SegmentedButtons ,FAB} from 'react-native-paper';
import { format, parseISO ,isToday} from 'date-fns'; // Import date-fns functions
import * as React from 'react';
import {useGetUserExpensesQuery} from '@/store/userApi';
const transactions = [
  { id: "1", title:"Dinner",imageType: "expense", amount: "₹60", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
  { id: "2",title:"Party", imageType: "expense", amount: "₹90", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
  { id: "3", title:"Travel",imageType: "expense", amount: "₹80", time: "6:16 pm · 19 Feb" ,transactionType: "expense"},
];
const groupTransactionsByDate = (transactions: any) => {
  const grouped: { [key: string]: any} = {};

  transactions.forEach((transaction:any) => {
    console.log(transaction);
    const date = transaction.created_at_date_time.split('T')[0]; // Get the date part (YYYY-MM-DD)
    console.log(date);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });

  return grouped;
};

// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";
export default function ActivityScreen() {
  
  
  const router = useRouter();
  const [value, setValue] = React.useState('');
    const {data: dataExpense, isLoading: isLoadingExpense, error: errorExpense} = useGetUserExpensesQuery({});
    if (isLoadingExpense) {
        return <Text>Loading...</Text>;
    }
      
    if (errorExpense) {
        return <Text>Error: {errorExpense?.message || JSON.stringify(errorExpense)}</Text>;
    }
    const Expenses = dataExpense.data;
    // console.log(detectedExpenses);
    const numberOfExpenses = Expenses.length;
  
    const groupedTransactions = groupTransactionsByDate(Expenses);
    const dates = Object.keys(groupedTransactions);
    console.log("Grouped Transactions:  ",groupedTransactions);
  return (
    <View style={styles.screen}>
        <ScrollView style={styles.container}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>      
          <Text style={styles.headerText}>All Expenses</Text>
          <View style={styles.navbar}>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: 'expense',
                  label: 'Expenses',
                  checkedColor:"red",
                  uncheckedColor:"black",
                },
                {
                  value: 'transaction',
                  label: 'Transactions',
                  onPress: ()=>router.push("../activity/activityTransaction"),

                  checkedColor:"red",
                  uncheckedColor:"black",
                },
                { 
                  value: 'settlement', 
                  label: 'Settlements',
                  onPress: ()=>router.push("../activity/activitySettlement"),

                  checkedColor:"red",
                  uncheckedColor:"black",

                },
              ]}
            />
          </View>

        {numberOfExpenses>0?(<View >
              {dates.map(date => (
                <View key={date} style={{backgroundColor:"white"}}>
                  <Text style={styles.sectionTitle}>
                      {isToday(parseISO(date)) ? 'Today' : format(parseISO(date), 'dd MMM')} {/* Check if today */}
                  </Text>
                  <FlatList
                    data={groupedTransactions[date]}
                    keyExtractor={(item) => item._id} // Use _id as the key
                    renderItem={({ item }) => (
                      <TransactionCard 
                        title={item.description} // Adjust based on your data structure
                        imageType={item.transactionType} // Adjust based on your data structure
                        amount={`₹${item.total_amount}`} // Adjust based on your data structure
                        subtitle={format(parseISO(item.created_at_date_time), 'hh:mm a')} // Format the time as needed
                        transactionType={item.transactionType} // Example logic for transaction type
                      />
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 10 , backgroundColor: 'white' }} />
                    )}
                    contentContainerStyle={{ paddingBottom: 0 }} // Ensure no extra padding
                  />
                </View>
              ))}
            </View>):
              <Text style= {styles.noExpensesText}>No Expenses Found</Text>
            }
        </ScrollView>
        <FAB
        label="Add Expense"
        style={styles.fab}
        onPress={() => router.push("../bills")}
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
},noExpensesText: {
  height: 100, // Set a fixed height to match the expected space
  justifyContent: 'center', // Center the text vertically
  alignItems: 'center', // Center the text horizontally
  textAlign: 'center', // Center the text
  fontSize: 16, // Adjust font size as needed
  color: 'gray', // Change color to indicate no transactions
  padding: 16, // Add some padding for better spacing
},
});