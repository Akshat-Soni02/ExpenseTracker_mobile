import { StyleSheet,ScrollView ,FlatList, ActivityIndicator} from "react-native";
import * as React from 'react';
import { FAB ,PaperProvider , Portal} from 'react-native-paper';
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "@/components/Themed";

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserBudgetsQuery} from '@/store/userApi'; 
import { globalStyles } from "@/styles/globalStyles";
import { Budget } from "@/store/budgetApi";
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import Header from "@/components/Header";

export default function BudgetsScreen() {
  const router = useRouter();
  const {data: dataBudget, isLoading: isLoadingBudget, error: errorBudget} = useGetUserBudgetsQuery();
  const [state, setState] = React.useState({ open: false });

  // if (isLoadingBudget) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (errorBudget) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorBudget) {
      errorMessage = `Server Error: ${JSON.stringify(errorBudget.data)}`;
    } else if ("message" in errorBudget) {
      errorMessage = `Client Error: ${errorBudget.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }


  const { open } : { open : boolean} = state;
  const onStateChange = ({ open } : { open : boolean}) => setState({ open });

  const budgets: Budget[] = dataBudget?.data || [];
  const numberOfBudgets: number = budgets.length;

  return (
    <PaperProvider>
    <View style={globalStyles.screen}>

        <ScrollView style={globalStyles.viewContainer}>
          
          <Header headerText="Budgets"/>

          {isLoadingBudget ? (
            <>
              {[...Array(6)].map((_, index) => (
                <View key={index} style={{ marginBottom: 20 }}>
                  <SkeletonPlaceholder style={{ height: 60, borderRadius: 10 }} />
                </View>
              ))}
            </>
          ) : (
            <>
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
            </>
          )}
          
        </ScrollView>

        {/* <FAB
        label="Add Budget"
        style={globalStyles.fab}
        onPress={() => router.push("/action/create/createBudget")}
        /> */}
        <Portal>
          <FAB.Group
            open={open}
            visible
            icon={open ? 'close' : 'plus'}
            actions={[
              {
                icon: 'brain',
                label: 'Predict Budget',
                onPress:()=>router.push({ pathname: "/view/viewPredictedBudget" }),
              },
              {
                icon: 'finance',
                label: 'Add Budget',
                onPress: () => router.push({ pathname: "/action/create/createBudget" }),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>

    </View>
    
    </PaperProvider>
    );
}
