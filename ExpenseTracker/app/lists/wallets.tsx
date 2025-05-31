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
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import Header from "@/components/Header";
import { testStyles } from "@/styles/test";
import { formatCurrency } from "../utils/helpers";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import AppFAB from "@/components/AppFab";


export default function WalletsScreen() {
  const router = useRouter();

  const {data: dataWallet, isLoading: isLoadingWallet, error: errorWallet, isError: hasErrorWallet} = useGetUserWalletsQuery();
    
  const errors = [errorWallet].filter(Boolean);
  const hasErrors = errors.length > 0;

  const handleRetry = () => {
    if (hasErrorWallet) console.log("retry triggered");
  };

  const wallets: Wallet[] = dataWallet?.data || [];
  const numberOfWallets: number = wallets.length;

  if (hasErrors) {
    return <ErrorState errors={errors} onRetry={handleRetry} />;
  }

  return (
    <View style={testStyles.screen}>
        <ScrollView style={testStyles.container}>
          
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
              { numberOfWallets > 0 ? (
              <FlatList
                data={wallets}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TransactionCard
                    pressFunction={() => router.push({ pathname: "/view/viewWallet", params: { id:item._id} })}
                    title = {item.wallet_title}
                    imageType = {undefined}
                    amount={`₹${formatCurrency(item.amount)}`}
                    transactionType={undefined}
                  />
                )}
                ItemSeparatorComponent={() => (
                  <View style={{  height: 5, backgroundColor: 'white'}} />
                )}
                contentContainerStyle={{ paddingBottom: 5 }}
              /> ) : (
                  <EmptyState
                    title="No Wallets"
                    subtitle="Use wallets to split costs, track transactions, and organize shared expenses."
                    iconName="wallet"
                  />
              )}
            </>
          )}
        </ScrollView>

        <AppFAB
          icon="plus"
          onPress={() => router.push("/action/create/createWallet")}
        />

    </View>);
}