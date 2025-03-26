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
import {useGetUserBillsQuery} from '@/store/userApi';
import { format } from "date-fns";
import SegmentedControl from "@/components/SegmentedControl";

export default function BillsScreen() {
  const router = useRouter();
  const [page, setPage] = React.useState("pending");
  const {data: dataPendingBills, isLoading: isLoadingPendingBills, error: errorPendingBills} = useGetUserBillsQuery({ status: "pending" });
  const {data: dataMissedBills, isLoading: isLoadingMissedBills, error: errorMissedBills} = useGetUserBillsQuery({ status: "missed" });
  const {data: dataCompletedBills, isLoading: isLoadingCompletedBills, error: errorCompletedBills} = useGetUserBillsQuery({ status: "paid" });

  if (isLoadingPendingBills || isLoadingMissedBills || isLoadingCompletedBills) {
      return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  }
    
  if (errorPendingBills) return <Text>Error: {errorPendingBills?.message || JSON.stringify(errorPendingBills)}</Text>;
  else if (errorMissedBills) return <Text>Error: {errorMissedBills?.message || JSON.stringify(errorMissedBills)}</Text>;
  else if(errorCompletedBills) return <Text>Error: {errorCompletedBills?.message || JSON.stringify(errorCompletedBills)}</Text>;
  
  const pendingBills = dataPendingBills.data;
  const numberOfPendingBills = pendingBills.length;

  const missedBills = dataMissedBills.data;
  const numberOfMissedBills = missedBills.length;


  const completedBills = dataCompletedBills.data;
  const numberOfCompletedBills = completedBills.length;

  if(page === "pending") {
    return (
        <View style={styles.screen}>
            <ScrollView style={styles.container}>
              
              <View style = {styles.header}>
                <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style = {{backgroundColor: "white"}}/>     
                <Text style={styles.headerText}>Bills</Text>
              </View>
              <View style={styles.navbar}>
                <SegmentedControl value={page} setValue={setPage} isBill={true}/>
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
                  <View style={{  height: 5, backgroundColor: 'white'}} />
                )}
                contentContainerStyle={{ paddingBottom: 5 }}  // Ensure no extra padding
                nestedScrollEnabled={true}
              />):
                <Text style={styles.noText}>No Pending Bills!</Text>
              }
              
            </ScrollView>
            <FAB
                label="Add Bill"
                style={styles.fab}
                onPress={() => router.push("../../createBill")}
            />
        </View>
      );
  } else if(page === "missed") {
        return (
            <View style={styles.screen}>
                <ScrollView style={styles.container}>
                  
                <View style = {styles.header}>
                <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.back()} style = {{backgroundColor: "white"}}/>     
                <Text style={styles.headerText}>Bills</Text>
              </View>
              <View style={styles.navbar}>
                <SegmentedControl value={page} setValue={setPage} isBill={true}/>
              </View>
                  {numberOfMissedBills>0?(<FlatList
                    data={missedBills}
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
                      <View style={{  height: 5, backgroundColor: 'white'}} />
                    )}
                    contentContainerStyle={{ paddingBottom: 5 }}  // Ensure no extra padding
                    nestedScrollEnabled={true}
                  />):
                    <Text style={styles.noText}>No Missed Bills!</Text>
                  }
                  
                </ScrollView>
                <FAB
                    label="Add Bill"
                    style={styles.fab}
                    onPress={() => router.push("../../createBill")}
                />
            </View>
          );
  } else {
        return (
            <View style={styles.screen}>
                <ScrollView style={styles.container}>
                  
                <View style = {styles.header}>
                <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.back()} style = {{backgroundColor: "white"}}/>     
                <Text style={styles.headerText}>Bills</Text>
              </View>
              <View style={styles.navbar}>
                <SegmentedControl value={page} setValue={setPage} isBill={true}/>
              </View>
                  {numberOfCompletedBills>0?(<FlatList
                    data={completedBills}
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
                      <View style={{  height: 5, backgroundColor: 'white'}} />
                    )}
                    contentContainerStyle={{ paddingBottom: 5 }}  // Ensure no extra padding
                    nestedScrollEnabled={true}
                  />):
                    <Text style={styles.noText}>No Completed Bills!</Text>
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
  backButton: {
    padding: 10
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
},
noText: {
  height: 100, // Set a fixed height to match the expected space
  justifyContent: 'center', // Center the text vertically
  alignItems: 'center', // Center the text horizontally
  textAlign: 'center', // Center the text
  fontSize: 16, // Adjust font size as needed
  color: 'gray', // Change color to indicate no transactions
  padding: 16, // Add some padding for better spacing
},
});