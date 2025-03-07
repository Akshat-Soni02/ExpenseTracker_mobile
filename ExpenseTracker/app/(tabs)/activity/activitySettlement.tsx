import { StyleSheet, Image,ScrollView ,FlatList} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { MaterialCommunityIcons,FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SegmentedButtons } from 'react-native-paper';
import * as React from 'react';
// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";

const transactions = [
  { id: "1", title:"Dinner", amount: "₹60", time: "6:16 pm · 19 Feb" },
  { id: "2",title:"Party", amount: "₹90", time: "6:16 pm · 19 Feb" },
  { id: "3", title:"Travel", amount: "₹80", time: "6:16 pm · 19 Feb" },
];
export default function ActivitySpendScreen() {
  const router = useRouter();
  const [value, setValue] = React.useState('');

  return (
    <ScrollView style={styles.container}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>      
          <Text style={styles.headerText}>All Records</Text>
          <View style={styles.navbar}>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: 'expense',
                  label: 'Expenses',
                  onPress: ()=>router.push("/activity"),

                  checkedColor:"red",
                  uncheckedColor:"black",
                },
                {
                  value: 'transaction',
                  label: 'Transactions',
                  onPress: ()=>router.push("/activity/activitySettlement"),

                  checkedColor:"red",
                  uncheckedColor:"black",
                },
                { 
                  value: 'settlement', 
                  label: 'Settlements',
                  

                  checkedColor:"red",
                  uncheckedColor:"black",
                },
              ]}
            />
          </View>
          {/* <View style={styles.navbar}>
            <TouchableOpacity  style={styles.navItem}><Text style={styles.navText}>Detected Transactions</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/activity/activitySplit")}><Text style={styles.navText}>Split Expenses</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/activity/activitySpend")}><Text style={styles.navText}>Spend Records</Text></TouchableOpacity>
          </View> */}
          <Text style={styles.sectionTitle}>Today</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionCard 
              title = {item.title}
              amount={item.amount}
              subtitle={item.time}
              />
              
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 1, backgroundColor: 'black'}} />
            )}
            contentContainerStyle={{ paddingBottom: 0 }}  // Ensure no extra padding

          />
          <Text style={[styles.sectionTitle,{paddingTop:20}]}>19 Feb</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionCard 
              title = {item.title}
              amount={item.amount}
              subtitle={item.time}
              />
              
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 1, backgroundColor: 'black'}} />
            )}
            contentContainerStyle={{ paddingBottom: 0 }}  // Ensure no extra padding

          />

        </ScrollView>
  );
}


const styles = StyleSheet.create({
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
});