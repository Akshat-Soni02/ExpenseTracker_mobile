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
  const numberOfWallets = wallets.length; 
  return (
    <View style={globalStyles.screen}>
        <ScrollView style={globalStyles.viewContainer}>
          
          <View style = {globalStyles.viewHeader}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style={globalStyles.backButton}/>
            <Text style={globalStyles.headerText}>Wallets</Text>
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

          />)
          :
          <Text style= {globalStyles.noText}>No wallets found</Text>
          }
          
        </ScrollView>
        <FAB
            label="Add Wallet"
            style={globalStyles.fab}
            onPress={() => router.push("/action/create/createWallet")}
        />
    </View>
  );
}