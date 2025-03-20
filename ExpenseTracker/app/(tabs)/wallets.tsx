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
import {useGetUserWalletsQuery} from '@/store/userApi'; 
const transactions = [
  { id: "1", title:"Cash",imageType: undefined, amount: "₹60", time: "cash" ,transactionType: undefined},
  { id: "2",title:"Kotak", imageType: undefined, amount: "₹90", time: "Acc. 12314" ,transactionType: undefined},
  { id: "3", title:"ICICI",imageType: undefined, amount: "₹80", time: "Acc. 65786" ,transactionType: undefined},
];
// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";
export default function WalletsScreen() {
  const router = useRouter();

  const [value, setValue] = React.useState('');
  const {data: dataWallet, isLoading: isLoadingWallet, error: errorWallet} = useGetUserWalletsQuery({});
  if (isLoadingWallet) {
      return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
    }
    
    if (errorWallet) {
      return <Text>Error: {errorWallet?.message || JSON.stringify(errorWallet)}</Text>;
    }
  const wallets = dataWallet.data;
  console.log(wallets);
  const numberOfWallets = wallets.length; 
  return (
    <View style={styles.screen}>
        <ScrollView style={styles.container}>
          
          <View style = {styles.header}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.back()} style={styles.backButton}/>
            <Text style={styles.headerText}>Wallets</Text>
          </View>
          
          {/* <View style={styles.navbar}>
            <TouchableOpacity  style={styles.navItem}><Text style={styles.navText}>Detected Transactions</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/activity/activitySplit")}><Text style={styles.navText}>Split Expenses</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/activity/activitySpend")}><Text style={styles.navText}>Spend Records</Text></TouchableOpacity>
          </View> */}
          {numberOfWallets>0 ?(<FlatList
            data={wallets}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TransactionCard
              pressFunction={() => router.push({ pathname: "../../viewWallet", params: { id:item._id} })}
              title = {item.wallet_title}
              imageType = {undefined}
              amount={`₹${item.amount}`}
              subtitle={`Lower Limit:${item.lower_limit}`}
              transactionType={undefined}
              />
              
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 5, backgroundColor: 'white'}} />
            )}
            contentContainerStyle={{ paddingBottom: 5 }}

          />)
          :
          <Text style= {styles.noWalletsText}>No Wallets Found</Text>
          }
          
        </ScrollView>
        <FAB
            label="Add Wallet"
            style={styles.fab}
            onPress={() => router.push("../createWallet")}
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
    padding: 10
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
});