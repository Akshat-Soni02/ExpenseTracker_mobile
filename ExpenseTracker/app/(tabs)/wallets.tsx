import { StyleSheet,ScrollView ,FlatList, ActivityIndicator} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';
import * as React from 'react';

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserWalletsQuery} from '@/store/userApi';
import { globalStyles } from "@/styles/globalStyles";
import { Wallet } from "@/store/walletApi";


export default function WalletsScreen() {
  const router = useRouter();

  const {data: dataWallet, isLoading: isLoadingWallet, error: errorWallet} = useGetUserWalletsQuery();

  if (isLoadingWallet) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (errorWallet) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorWallet) {
      errorMessage = `Server Error: ${JSON.stringify(errorWallet.data)}`;
    } else if ("message" in errorWallet) {
      errorMessage = `Client Error: ${errorWallet.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }
    
  const wallets: Wallet[] = dataWallet?.data || [];
  const numberOfWallets: number = wallets.length;

  return (
    <View style={styles.screen}>
        <ScrollView style={styles.container}>
          
          <View style = {styles.header}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style={styles.backButton}/>
            <Text style={styles.headerText}>Wallets</Text>
          </View>
          
          {numberOfWallets>0 ?(
            <FlatList
            data={wallets}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TransactionCard
              pressFunction={() => router.push({ pathname: "/view/viewWallet", params: { id:item._id} })}
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
          />) : <Text style= {styles.noWalletsText}>No wallets</Text>}
          
        </ScrollView>

        <FAB
        label="Add Wallet"
        style={styles.fab}
        onPress={() => router.push("/action/create/createWallet")}
        />

    </View>);
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