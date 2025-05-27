import { FlatList,RefreshControl} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';
import * as React from 'react';

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserWalletsQuery} from '@/store/userApi';
import { globalStyles } from "@/styles/globalStyles";
import { Wallet } from "@/store/walletApi";
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import Header from "@/components/Header";


export default function WalletsScreen() {
  const router = useRouter();

  const {data: dataWallet, isLoading: isLoadingWallet, error: errorWallet,isFetching,refetch} = useGetUserWalletsQuery();

  // if (isLoadingWallet) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

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
    <View style={globalStyles.screen}>
        <View style={globalStyles.viewContainer}>
          
          <Header headerText="Wallets"/>

          {isLoadingWallet ? (
            <>
              {[...Array(6)].map((_, index) => (
                <View key={index} style={{ marginBottom: 20 }}>
                  <SkeletonPlaceholder style={{ height: 60, borderRadius: 10 }} />
                </View>
              ))}
            </>
          ) : (
            <>
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
              contentContainerStyle={{ paddingBottom: 5,flexGrow: 1}}
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={refetch} />
              }
            />)
            :
            <Text style= {globalStyles.noText}>No wallets found</Text>
            }
            </>
          )}
          
        </View>

        <FAB
            label="Add Wallet"
            style={globalStyles.fab}
            onPress={() => router.push("/action/create/createWallet")}
        />

    </View>);
}