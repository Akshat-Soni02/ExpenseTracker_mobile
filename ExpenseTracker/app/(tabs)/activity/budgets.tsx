import { StyleSheet,ScrollView ,FlatList, ActivityIndicator} from "react-native";
import * as React from 'react';
import { FAB } from 'react-native-paper';
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "@/components/Themed";

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserBudgetsQuery} from '@/store/userApi'; 
import { globalStyles } from "@/styles/globalStyles";
import { Budget } from "@/store/budgetApi";

export default function BudgetsScreen() {
  const router = useRouter();
  const {data: dataBudget, isLoading: isLoadingBudget, error: errorBudget} = useGetUserBudgetsQuery();

  if (isLoadingBudget) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (errorBudget) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorBudget) {
      errorMessage = `Server Error: ${JSON.stringify(errorBudget.data)}`;
    } else if ("message" in errorBudget) {
      errorMessage = `Client Error: ${errorBudget.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  const budgets: Budget[] = dataBudget?.data || [];
  const numberOfBudgets: number = budgets.length;

  return (
    <View style={globalStyles.screen}>

        <ScrollView style={globalStyles.viewContainer}>
          
          <View style = {globalStyles.viewHeader}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style = {globalStyles.backButton}/>     
            <Text style={globalStyles.headerText}>Budgets</Text>
          </View>
          
          {numberOfBudgets>0 ? (
            <FlatList
            data={budgets}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TransactionCard 
              title = {item.budget_title}
              imageType = {undefined}
              amount={`₹${item.amount}`}
              subtitle={`Current Spend: ₹${item.current_spend}`}
              optionText={item.period}
              transactionType={undefined}
              pressFunction={() => router.push({ pathname: "/view/viewBudget", params: { id: item._id } })}
              />
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 5, backgroundColor: 'white'}} />
            )}
            contentContainerStyle={{ paddingBottom: 5 }}
            nestedScrollEnabled={true}
          />) : (<Text style={globalStyles.noText}>Create a budget to keep track categorical track of your expenses</Text>)}
          
        </ScrollView>

        <FAB
        label="Add Budget"
        style={globalStyles.fab}
        onPress={() => router.push("/action/create/createBudget")}
        />

    </View>);
}
