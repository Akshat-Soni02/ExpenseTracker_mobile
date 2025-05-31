import { StyleSheet,ScrollView,FlatList } from "react-native";
import { View } from "@/components/Themed";
import { useRouter } from "expo-router";

import {friend, useGetUserFriendsQuery} from '@/store/userApi';
import TransactionCard from "@/components/readComponents/TransactionCard";
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import Header from "@/components/Header";
import { testStyles } from "@/styles/test";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import AppFAB from "@/components/AppFab";
import { formatCurrency } from "../utils/helpers";

export default function PeopleScreen() {

  const router = useRouter();

  const {data: dataPeople, isLoading: isLoadingPeople, error: errorPeople, isError: hasErrorPeople} = useGetUserFriendsQuery();

  const errors = [errorPeople].filter(Boolean);
  const hasErrors = errors.length > 0;

  const handleRetry = () => {
    if (hasErrorPeople) console.log("retry triggered");
  };

  const people: friend[] = dataPeople?.data || [];
  const numberOfPeople: number = people.length;

  if (hasErrors) {
    return <ErrorState errors={errors} onRetry={handleRetry} />;
  }

  return (
    <View style={testStyles.screen}>
        <ScrollView style={testStyles.container}>

          <Header headerText="Friends"/>

          <View style={styles.transactionsContainer}>
            {isLoadingPeople ? (
              <>
                {[...Array(6)].map((_, index) => (
                  <View key={index} style={{ marginBottom: 20 }}>
                    <SkeletonPlaceholder style={{ height: 60, borderRadius: 10 }} />
                  </View>
                ))}
              </>
            ) : (
              <>
                { numberOfPeople > 0 ? (
                  <FlatList
                    data={people}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <TransactionCard
                        pressFunction = {() => router.push({ pathname: "/view/viewPeople", params: {id: item._id, amount: item.amount} })}
                        imageName={item.profile_photo}
                        title = {item.name}
                        amount={`₹${formatCurrency(Math.abs(item.amount))}`}
                        subtitle={undefined}
                        optionText={item.type === "credit" ? "You lend" : item.type === "debit" ? "You owe" : undefined}
                        transactionType={item.type}
                      />
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={{  height: 5 , backgroundColor: 'white'}} />
                    )}
                    contentContainerStyle={{ paddingBottom: 5 }}
                  />) : (
                      <EmptyState
                        title="No Friends"
                        subtitle="Add friends to split bills, share expenses, and settle up easily."
                        iconName="account"
                      />
                )}
              </>
            )}
          </View>
        </ScrollView>

        <AppFAB
          icon="plus"
          onPress={() => router.push("/action/create/addPeopleManual")}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsContainer: {
    width: "100%",
    paddingVertical: 10, 
    backgroundColor:"white",
  },
});