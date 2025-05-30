import { StyleSheet,ScrollView ,FlatList, ActivityIndicator} from "react-native";
import { FAB } from 'react-native-paper';
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import * as React from 'react';

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserBillsQuery} from '@/store/userApi';
import { format } from "date-fns";
import SegmentedControl from "@/components/readComponents/SegmentedControl";
import { globalStyles } from "@/styles/globalStyles";
import { Bill } from "@/store/billApi";
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import Header from "@/components/Header";
import { formatDate } from "../utils/dateUtils";


export default function BillsScreen() {

  const router = useRouter();
  const [page, setPage] = React.useState<"pending" | "missed" | "paid">("pending");

  const {data: dataPendingBills, isLoading: isLoadingPendingBills, error: errorPendingBills} = useGetUserBillsQuery({ status: "pending" });
  const {data: dataMissedBills, isLoading: isLoadingMissedBills, error: errorMissedBills} = useGetUserBillsQuery({ status: "missed" });
  const {data: dataCompletedBills, isLoading: isLoadingCompletedBills, error: errorCompletedBills} = useGetUserBillsQuery({ status: "paid" });

  // if (isLoadingPendingBills || isLoadingMissedBills || isLoadingCompletedBills) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
    
  if (errorPendingBills) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorPendingBills) {
      errorMessage = `Server Error: ${JSON.stringify(errorPendingBills.data)}`;
    } else if ("message" in errorPendingBills) {
      errorMessage = `Client Error: ${errorPendingBills.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  else if (errorMissedBills) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorMissedBills) {
      errorMessage = `Server Error: ${JSON.stringify(errorMissedBills.data)}`;
    } else if ("message" in errorMissedBills) {
      errorMessage = `Client Error: ${errorMissedBills.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  else if (errorCompletedBills) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorCompletedBills) {
      errorMessage = `Server Error: ${JSON.stringify(errorCompletedBills.data)}`;
    } else if ("message" in errorCompletedBills) {
      errorMessage = `Client Error: ${errorCompletedBills.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }
  
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

  if(page === "pending") {
    return (
        <View style={globalStyles.screen}>
            <ScrollView style={globalStyles.viewContainer}>
              
              <Header headerText="Bills"/>
              <View style={globalStyles.navbar}>
                <SegmentedControl value={page} setValue={setPage} isBill={true}/>
              </View>

              {isLoadingPendingBills ? (
                <>
                  {[...Array(6)].map((_, index) => (
                    <View key={index} style={{ marginBottom: 20 }}>
                      <SkeletonPlaceholder style={{ height: 60, borderRadius: 10 }} />
                    </View>
                  ))}
                </>
              ) : (
                <>
                  {numberOfPendingBills>0 ? (
                <FlatList
                data={pendingBills}
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
              />):
                <Text style={globalStyles.noText}>No pending bills</Text>
              }
                </>
              )}
              
            </ScrollView>

            <FAB
                label="Add Bill"
                style={globalStyles.fab}
                onPress={() => router.push("/action/create/createBill")}
            />

        </View>);

  } else if(page === "missed") {
        return (
            <View style={globalStyles.screen}>
                <ScrollView style={globalStyles.viewContainer}>
                  
                <Header headerText="Bills"/>
              <View style={globalStyles.navbar}>
                <SegmentedControl value={page} setValue={setPage} isBill={true}/>
              </View>

              {isLoadingCompletedBills ? (
                <>
                  {[...Array(6)].map((_, index) => (
                    <View key={index} style={{ marginBottom: 20 }}>
                      <SkeletonPlaceholder style={{ height: 60, borderRadius: 10 }} />
                    </View>
                  ))}
                </>
              ) : (
                <>
                  {numberOfMissedBills>0?(<FlatList
                    data={missedBills}
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
                  />):
                    <Text style={globalStyles.noText}>No missed bills</Text>
                  }
                </>
              )}
                  
                </ScrollView>

                <FAB
                    label="Add Bill"
                    style={globalStyles.fab}
                    onPress={() => router.push("/action/create/createBill")}
                />

            </View>);

  } else {
        return (
            <View style={globalStyles.screen}>
                <ScrollView style={globalStyles.viewContainer}>
                  
                <Header headerText="Bills"/>
              <View style={globalStyles.navbar}>
                <SegmentedControl value={page} setValue={setPage} isBill={true}/>
              </View>

              {isLoadingMissedBills ? (
                <>
                  {[...Array(6)].map((_, index) => (
                    <View key={index} style={{ marginBottom: 20 }}>
                      <SkeletonPlaceholder style={{ height: 60, borderRadius: 10 }} />
                    </View>
                  ))}
                </>
              ) : (
                <>
                  {numberOfCompletedBills>0?(<FlatList
                    data={completedBills}
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
                  />):
                    <Text style={globalStyles.noText}>No completed bills</Text>
                  }
                </>
              )}
                  
                </ScrollView>

                <FAB
                    label="Add Bill"
                    style={globalStyles.fab}
                    onPress={() => router.push("/action/create/createBill")}
                />

            </View>);
  }
}