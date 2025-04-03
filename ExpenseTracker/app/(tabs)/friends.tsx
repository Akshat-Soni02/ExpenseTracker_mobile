import { StyleSheet,ScrollView,FlatList, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from "react-native-paper";

import {friends, useGetUserFriendsQuery} from '@/store/userApi';
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

  const people: friends[] = dataPeople?.data || [];
  const numberOfPeople: number = people.length;

  return (
    <View style={[{flex:1}]}>
        <ScrollView style={styles.container}>

          <View style = {styles.header}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style={styles.backButton}/>
            <Text style={styles.headerText}>Friends</Text>
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
              />) : <Text style = {styles.noPeopleText}>No Friends yet</Text>}
          </View>

        </ScrollView>

        <FAB
        label="Add Friends"
        style={styles.fab}
        onPress={() => router.push("/action/create/addPeopleManual")}
        />

        </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 0, // Add padding to the top to avoid overlap with status bar
  },
  header: {
    color: "black",
    backgroundColor: "white",
    paddingInline: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10
  },
  backButton: {
    // position: "absolute",
    padding: 10
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black"
  },
  transactionsContainer: {
    // marginTop: 20, // Space above the transactions
    // alignItems: "flex-start",
    width: "100%",
    paddingVertical: 10, // Space above and below the transactions
    backgroundColor:"white",
  },
  noPeopleText: {
    height: 100, // Set a fixed height to match the expected space
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    textAlign: 'center', // Center the text
    fontSize: 16, // Adjust font size as needed
    color: 'gray', // Change color to indicate no transactions
    padding: 16, // Add some padding for better spacing
  },fab: {
    position: "absolute",
    margin: 16,
    backgroundColor:"#f8f9fa",
    right: 0,
    bottom: 0,
},
});