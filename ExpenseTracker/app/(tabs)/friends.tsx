import { StyleSheet,ScrollView,FlatList, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from "react-native-paper";

import {friend, useGetUserFriendsQuery} from '@/store/userApi';
import TransactionCard from "@/components/readComponents/TransactionCard";
import { globalStyles } from "@/styles/globalStyles";

export default function PeopleScreen() {

  const router = useRouter();

  const {data: dataPeople, isLoading: isLoadingPeople, error: errorPeople} = useGetUserFriendsQuery();

  if (isLoadingPeople) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (errorPeople) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorPeople) {
      errorMessage = `Server Error: ${JSON.stringify(errorPeople.data)}`;
    } else if ("message" in errorPeople) {
      errorMessage = `Client Error: ${errorPeople.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  const people: friend[] = dataPeople?.data || [];
  const numberOfPeople: number = people.length;

  return (
    <View style={[{flex:1}]}>
        <ScrollView style={globalStyles.viewContainer}>

          <View style = {globalStyles.viewHeader}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style={globalStyles.backButton}/>
            <Text style={globalStyles.headerText}>Friends</Text>
          </View>

          <View style={styles.transactionsContainer}>

            {numberOfPeople>0 ? (
              <FlatList
              data={people}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TransactionCard
                pressFunction = {() => router.push({ pathname: "/view/viewPeople", params: {id: item._id, amount: item.amount} })}
                imageName={item.profile_photo}
                title = {item.name}
                amount={`₹${Math.abs(item.amount).toFixed(2)}`}
                subtitle={undefined}
                optionText={item.type === "credit" ? "You lend" : item.type === "debit" ? "You owe" : undefined}
                transactionType={item.type}
                />
              )}
              ItemSeparatorComponent={() => (
                <View style={{  height: 5 , backgroundColor: 'white'}} />
              )}
              contentContainerStyle={{ paddingBottom: 5 }}
              />) : <Text style = {globalStyles.noText}>No Friends yet</Text>}
          </View>

        </ScrollView>

        <FAB
        label="Add Friends"
        style={globalStyles.fab}
        onPress={() => router.push("/action/create/addPeopleManual")}
        />

        </View>);
}

const styles = StyleSheet.create({
  transactionsContainer: {
    width: "100%",
    paddingVertical: 10, 
    backgroundColor:"white",
  },
});