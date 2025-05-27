import { FlatList, RefreshControl,ScrollView} from "react-native";
import { FAB } from 'react-native-paper';
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import * as React from 'react';

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserBillsQuery} from '@/store/userApi';
import { format } from "date-fns";
import SegmentedControl from "@/components/readComponents/SegmentedControl";
import { globalStyles } from "@/styles/globalStyles";
import { Bill } from "@/store/billApi";
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import Header from "@/components/Header";


export default function BillsScreen() {

  const router = useRouter();
  const [page, setPage] = React.useState<"pending" | "missed" | "paid">("pending");

  const {data: dataPendingBills, isLoading: isLoadingPendingBills, error: errorPendingBills,isFetching:isFetchingPending,refetch:refetchPending} = useGetUserBillsQuery({ status: "pending" });
  const {data: dataMissedBills, isLoading: isLoadingMissedBills, error: errorMissedBills,isFetching:isFetchingMissed,refetch:refetchMissed} = useGetUserBillsQuery({ status: "missed" });
  const {data: dataCompletedBills, isLoading: isLoadingCompletedBills, error: errorCompletedBills,isFetching:isFetchingPaid,refetch:refetchPaid} = useGetUserBillsQuery({ status: "paid" });

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
                  <TransactionCard
                  pressFunction = {() => router.push({ pathname: "/view/viewBill", params: { id:item._id} })} 
                  title = {item.bill_title}
                  imageType = {undefined}
                  amount={`₹${item.amount}`}
                  subtitle={`Due date: ${format(new Date(item.due_date_time), "MMMM dd, yyyy")}`}
                  transactionType={undefined}
                  />
                )}
                ItemSeparatorComponent={() => (
                  <View style={{  height: 5, backgroundColor: 'white'}} />
                )}
                contentContainerStyle={{ paddingBottom: 5,flexGrow: 1 }}
                refreshControl={
                  <RefreshControl refreshing={isFetchingPending} onRefresh={refetchPending} />
                }
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
                      <TransactionCard
                      pressFunction = {() => router.push({ pathname: "/view/viewBill", params: { id:item._id} })}
                      title = {item.bill_title}
                      imageType = {undefined}
                      amount={`₹${item.amount}`}
                      subtitle={`Due date: ${format(new Date(item.due_date_time), "MMMM dd, yyyy")}`}
                      transactionType={undefined}
                      />
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={{  height: 5, backgroundColor: 'white'}} />
                    )}
                    contentContainerStyle={{ paddingBottom: 5 ,flexGrow: 1 }}
                    refreshControl={
                      <RefreshControl refreshing={isFetchingMissed} onRefresh={refetchMissed} />
                    }
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
                      <TransactionCard
                      pressFunction = {() => router.push({ pathname: "/view/viewBill", params: { id:item._id} })}
                      title = {item.bill_title}
                      imageType = {undefined}
                      amount={`₹${item.amount}`}
                      subtitle={`Due date: ${format(new Date(item.due_date_time), "MMMM dd, yyyy")}`}
                      transactionType={undefined}
                      />
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={{  height: 5, backgroundColor: 'white'}} />
                    )}
                    contentContainerStyle={{ paddingBottom: 5,flexGrow: 1 }}
                    refreshControl={
                      <RefreshControl refreshing={isFetchingPaid} onRefresh={refetchPaid} />
                    }
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