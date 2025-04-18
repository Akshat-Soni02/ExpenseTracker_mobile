import { StyleSheet,ScrollView ,FlatList, ActivityIndicator} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';
import * as React from 'react';

import { format, parseISO ,isToday} from 'date-fns';
import {useGetUserExpensesQuery, useGetUserPersonalTransactionsQuery, useGetUserSettlementsQuery} from '@/store/userApi';
import SegmentedControl from "@/components/readComponents/SegmentedControl";
import TransactionCard from "@/components/readComponents/TransactionCard";
import { globalStyles } from "@/styles/globalStyles";
import { Expense } from "@/store/expenseApi";
import { Settlement } from "@/store/settlementApi";
import { Transaction } from "@/store/personalTransactionApi";


export default function ActivityScreen() {
  const router = useRouter();
  const [page, setPage] = React.useState<"splits" | "spends" | "setttlements">("splits");

  const {data: dataExpense, isLoading: isLoadingExpense, error: errorExpense} = useGetUserExpensesQuery();
  const {data: dataSettlement, isLoading: isLoadingSettlement, error: errorSettlement} = useGetUserSettlementsQuery();
  const {data: dataPersonalTransaction, isLoading: isLoadingPersonalTransaction, error: errorPersonalTransaction} = useGetUserPersonalTransactionsQuery();
  
  if (isLoadingExpense || isLoadingPersonalTransaction || isLoadingSettlement) {
      return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  }
  

if (errorExpense) {
  let errorMessage = "An unknown error occurred";

  if ("status" in errorExpense) {
    errorMessage = `Server Error: ${JSON.stringify(errorExpense.data)}`;
  } else if ("message" in errorExpense) {
    errorMessage = `Client Error: ${errorExpense.message}`;
  }
  return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
}

else if (errorPersonalTransaction) {
  let errorMessage = "An unknown error occurred";

  if ("status" in errorPersonalTransaction) {
    errorMessage = `Server Error: ${JSON.stringify(errorPersonalTransaction.data)}`;
  } else if ("message" in errorPersonalTransaction) {
    errorMessage = `Client Error: ${errorPersonalTransaction.message}`;
  }
  return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
}

else if (errorSettlement) {
  let errorMessage = "An unknown error occurred";

  if ("status" in errorSettlement) {
    errorMessage = `Server Error: ${JSON.stringify(errorSettlement.data)}`;
  } else if ("message" in errorSettlement) {
    errorMessage = `Client Error: ${errorSettlement.message}`;
  }
  return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
}
  

  const Expenses: Expense[] = dataExpense?.data || [];
  const numberOfExpenses: number = Expenses.length;

  const settlements: Settlement[] = dataSettlement?.data || [];
  const numberOfSettlements: number = settlements.length;

  const personalTransactions: Transaction[] = dataPersonalTransaction?.data || [];
  const numberOfPersonalTransactions: number = personalTransactions.length;

  const groupTransactionsByDate = <T extends { created_at_date_time: Date }>(transactions: T[]) => {
    const grouped: Record<string, T[]> = {};
  
    transactions.forEach((transaction) => {
      const date = transaction.created_at_date_time.toString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
  
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => new Date(b.created_at_date_time).getTime() - new Date(a.created_at_date_time).getTime());
    });
    
    return grouped;
  };
  
  const tempGroupTransactionsByDate = (transactions: Settlement[]) => {
    const grouped: Record<string, Settlement[]> = {};
  
    transactions.forEach((transaction) => {
      const date = new Date().toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  }

  const groupedSettlements: Record<string, Settlement[]> = tempGroupTransactionsByDate(settlements);
  const settlementDates = Object.keys(groupedSettlements).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const groupedPersonalTransactions: Record<string, Transaction[]> = groupTransactionsByDate(personalTransactions);
  const personalTransactionDates = Object.keys(groupedPersonalTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const groupedExpenses: Record<string, Expense[]> = groupTransactionsByDate(Expenses);
  const expenseDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if(page === "splits") {
      return (
        <View style={globalStyles.screen}>
            <ScrollView style={globalStyles.viewContainer}>
              
            <View style = {globalStyles.viewHeader}>
              <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style = {{backgroundColor: "white"}}/>     
              <Text style={globalStyles.headerText}>Activity</Text>
            </View>

            <View style={globalStyles.navbar}>
              <SegmentedControl value={page} setValue={setPage} isBill={false}/>
            </View>
    
            {numberOfExpenses>0 ? (
              <View >
                  {expenseDates.map(date => (
                    <View key={date} style={{backgroundColor:"white"}}>
                      <Text style={styles.sectionTitle}>
                          {isToday(parseISO(date)) ? 'Today' : format(parseISO(date), 'dd MMM')}
                      </Text>

                      <FlatList
                        data={groupedExpenses[date]}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                          <TransactionCard 
                            pressFunction = {() => router.push({ pathname: "/view/viewExpense", params: { id:item._id} })}
                            title={item.description}
                            imageType={undefined}
                            amount={`₹${item.total_amount}`}
                            subtitle={format(parseISO(item.created_at_date_time.toString()), 'hh:mm a')}
                            transactionType={undefined}
                          />
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 5 , backgroundColor: 'white' }} />
                        )}
                        contentContainerStyle={{ paddingBottom: 5 }}
                        nestedScrollEnabled={true}
                      />

                    </View>
                  ))}
                </View>) : <Text style= {globalStyles.noText}>No splits</Text>}

            </ScrollView>

            <FAB
            label="Add split"
            style={globalStyles.fab}
            onPress={() => router.push("/action/create/createExpense")}
            />

        </View>);

    } else if (page === "spends") {
      return (
        <View style={globalStyles.screen}>
          <ScrollView style={globalStyles.viewContainer}>
              
            <View style = {globalStyles.viewHeader}>

              <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")}/>     
                <Text style={globalStyles.headerText}>Activity</Text>
              </View>

              <View style={globalStyles.navbar}>
                <SegmentedControl value={page} setValue={setPage} isBill={false}/>
              </View>

              {numberOfPersonalTransactions>0 ? (
                <View>
                  {personalTransactionDates.map(date => (
                    <View key={date} style={{backgroundColor:"white"}}>

                      <Text style={styles.sectionTitle}>
                          {isToday(parseISO(date)) ? 'Today' : format(parseISO(date), 'dd MMM')}
                      </Text>

                      <FlatList
                        data={groupedPersonalTransactions[date]}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                          <TransactionCard 
                            pressFunction = {() => router.push({ pathname: "/view/viewTransaction", params: { id:item._id} })}
                            title={item.description}
                            imageType={item.transaction_type}
                            amount={`₹${item.amount}`}
                            subtitle={format(parseISO(item.created_at_date_time.toString()), 'hh:mm a')}
                            transactionType={item.transaction_type}
                          />
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 5 , backgroundColor: 'white' }} />
                        )}
                        contentContainerStyle={{ paddingBottom: 0 }}
                        nestedScrollEnabled={true}
                      />

                    </View>
                  ))}
                </View>) : <Text style= {globalStyles.noText}>No spends found</Text>}
    
            </ScrollView>

            <FAB
            label="Add Spend"
            style={globalStyles.fab}
            onPress={() => router.push("/action/create/createTransaction")}
            />

        </View>);

    } else {
      return (
        <View style={globalStyles.screen}>

          <ScrollView style={globalStyles.viewContainer}>

          <View style = {globalStyles.viewHeader}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")}/>     
              <Text style={globalStyles.headerText}>Activity</Text>
            </View>

            <View style={globalStyles.navbar}>
              <SegmentedControl value={page} setValue={setPage} isBill={false}/>
            </View>
              
            {numberOfSettlements>0? ( 
              <View>

                {settlementDates.map(date => (
                  <View key={date} style={{backgroundColor:"white"}}>

                    <Text style={styles.sectionTitle}>
                        {isToday(parseISO(date)) ? 'Today' : format(parseISO(date), 'dd MMM')}
                    </Text>

                    <FlatList
                      data={groupedSettlements[date]}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <TransactionCard
                          pressFunction={() => router.push({ pathname: "/view/viewSettlement", params: { id:item._id} })}
                          title={item.settlement_description}
                          imageType={undefined}
                          amount={`₹${item.amount}`}
                          subtitle={format(parseISO(new Date().toISOString()), 'hh:mm a')}
                          transactionType={undefined}
                        />
                      )}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 5 , backgroundColor: 'white' }} />
                      )}
                      contentContainerStyle={{ paddingBottom: 0 }}
                      nestedScrollEnabled={true}
                    />

                  </View>
                ))}
              </View>) : <Text style= {globalStyles.noText}>No settlements</Text>}

            </ScrollView>

          </View>);
    }
}

const styles = StyleSheet.create({
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: "black"
  },
});