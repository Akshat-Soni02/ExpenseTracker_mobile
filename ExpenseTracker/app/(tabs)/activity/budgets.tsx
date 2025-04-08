import { ScrollView ,FlatList, ActivityIndicator} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';
import * as React from 'react';
import {useGetUserBudgetsQuery} from '@/store/userApi'; 

export default function BudgetsScreen() {
  const router = useRouter();
  const [value, setValue] = React.useState('');
  const {data: dataBudget, isLoading: isLoadingBudget, error: errorBudget} = useGetUserBudgetsQuery({});
  
  if (isLoadingBudget) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;  
  if (errorBudget) {
    return <Text>Error: {errorBudget?.message || JSON.stringify(errorBudget)}</Text>;
  }

  const budgets = dataBudget.data;
  const numberOfBudgets = budgets.length; 

  return (
    <View style={globalStyles.screen}>
        <ScrollView style={globalStyles.viewContainer}>
          
          <View style = {globalStyles.viewHeader}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style = {globalStyles.backButton}/>     
            <Text style={globalStyles.headerText}>Budgets</Text>
          </View>

          {numberOfBudgets>0?(<FlatList
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
          />):
          <Text style={globalStyles.noText}>No budgets found</Text>
          }
          
        </ScrollView>
        <FAB
            label="Add Budget"
            style={globalStyles.fab}
            onPress={() => router.push("/action/create/createBudget")}
        />
    </View>
  );
}
