import { ScrollView ,FlatList} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import * as React from 'react';

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserBillsQuery} from '@/store/userApi';
import SegmentedControl from "@/components/readComponents/SegmentedControl";
import { Bill } from "@/store/billApi";
import Header from "@/components/Header";
import { formatDate } from "../utils/dateUtils";
import { testStyles } from "@/styles/test";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import AppFAB from "@/components/AppFab";



export default function BillsScreen() {

  const router = useRouter();
  const [page, setPage] = React.useState<"pending" | "missed" | "paid">("pending");

  const {data: dataPendingBills, isLoading: isLoadingPendingBills, error: errorPendingBills, isError: hasErrorPending} = useGetUserBillsQuery({ status: "pending" });
  const {data: dataMissedBills, isLoading: isLoadingMissedBills, error: errorMissedBills, isError: hasErrorMissed} = useGetUserBillsQuery({ status: "missed" });
  const {data: dataCompletedBills, isLoading: isLoadingCompletedBills, error: errorCompletedBills, isError: hasErrorCompleted} = useGetUserBillsQuery({ status: "paid" });
  
  const errors = [errorCompletedBills, errorMissedBills, errorPendingBills].filter(Boolean);
  const hasErrors = errors.length > 0;

  const handleRetry = () => {
    if (hasErrorCompleted) console.log("retry triggered");
    if (hasErrorMissed) console.log("retry triggered");
    if (hasErrorPending) console.log("retry triggered");
  };


  const pendingBills: Bill[] = dataPendingBills?.data || [];
  const numberOfPendingBills: number = pendingBills.length;

  const missedBills: Bill[] = dataMissedBills?.data || [];
  const numberOfMissedBills: number = missedBills.length;


  const completedBills: Bill[] = dataCompletedBills?.data || [];
  const numberOfCompletedBills: number = completedBills.length;

  const BillRow = ({bill} : {bill: Bill}) => {
    return (
      <TransactionCard
        pressFunction = {() => router.push({ pathname: "/view/viewBill", params: { id:bill._id} })} 
        title = {bill.bill_title}
        imageType = {undefined}
        amount={`₹${bill.amount}`}
        subtitle={`Due date: ${formatDate(bill.due_date_time)}`}
        transactionType={undefined}
      />
    )
  }

  const loadingState = isLoadingPendingBills || isLoadingCompletedBills || isLoadingMissedBills;
  const numOfBills = page === "pending" ? numberOfPendingBills : page === "missed" ? numberOfMissedBills : numberOfCompletedBills;
  const listData = page === "pending" ? pendingBills : page === "missed" ? missedBills : completedBills;

  if (hasErrors) {
    return <ErrorState errors={errors} onRetry={handleRetry} />;
  }

  return (
    <View style={testStyles.screen}>
        <ScrollView style={testStyles.container}>
          
          <Header headerText="Bills" hideBackButton/>

          <View style={[{marginBottom: 20}]}>
            <SegmentedControl value={page} setValue={setPage} isBill={true}/>
          </View>

          {loadingState ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
          ) : (
            <>
              { numOfBills > 0 ? (
                <FlatList
                    data={listData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <BillRow bill={item}/>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={{  height: 5, backgroundColor: 'white'}} />
                    )}
                    contentContainerStyle={{ paddingBottom: 5 }}
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                />) : (
                  <EmptyState
                    title="No Bills"
                    subtitle="Bills help you track recurring payments like rent, subscriptions, or utilities."
                    iconName="sticker-check-outline"
                  />
                )
              }
            </>
          )}
        </ScrollView>

        <AppFAB
          icon="plus"
          onPress={() => router.push("/action/create/createBill")}
        />
    </View>
  );
}