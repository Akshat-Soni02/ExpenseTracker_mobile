import { StyleSheet, Image,ScrollView,FlatList, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { MaterialCommunityIcons,FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import {useGetUserFriendsQuery} from '@/store/userApi';
import { FAB } from "react-native-paper";
const people = [
  { id: "1", title:"Akshat",imageName:"Akshat", amount: "₹60", time: "3 unsettled splits" ,optionText:"You Owe",transactionType:"income"},
  { id: "2",title:"Atharva",imageName:"Atharva",amount: "₹90", time: "2 unsettled splits" ,optionText:"You are Due",transactionType:"expense"},
  { id: "3", title:"ABC",imageName:"ABC", amount: "₹80", time: "5 unsettled splits" ,optionText:"You Owe",transactionType:"income"},
];
// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";
export default function PeopleScreen() {
  const router = useRouter();
  const {data: dataPeople, isLoading: isLoadingPeople, error: errorPeople} = useGetUserFriendsQuery({});
  if (isLoadingPeople) {
      return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
    }
    
    if (errorPeople) {
      return <Text>Error: {errorPeople?.message || JSON.stringify(errorPeople)}</Text>;
    }
  const people = dataPeople.data;
  const numberOfPeople = people.length;

  return (
    <View style={[{flex:1}]}>
        <ScrollView style={styles.container}>   
          <View style = {styles.header}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.back()} style={styles.backButton}/>
            <Text style={styles.headerText}>Friends</Text>
          </View>
          <View style={styles.transactionsContainer}>
          {numberOfPeople>0?(<FlatList
              data={people}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TransactionCard
                pressFunction = {() => router.push({ pathname: "/viewPeople", params: {id: item._id, amount: item.amount} })}
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
              contentContainerStyle={{ paddingBottom: 5 }}  // Ensure no extra padding

            />):
            <Text style = {styles.noPeopleText}>No People Found</Text>
            }
          </View>
        </ScrollView>
        <FAB
                    label="Add Friends"
                    style={styles.fab}
                    onPress={() => router.push("/addFriends")}
        />
        </View>
  );
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