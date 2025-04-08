import { StyleSheet, Image,ScrollView,FlatList, ActivityIndicator ,Alert} from "react-native";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { MaterialCommunityIcons,FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import {useGetUserFriendsQuery,useRemindUserBorrowerMutation} from '@/store/userApi';
import {useGetUserExchangeStateInGroupQuery} from '@/store/groupApi';
import { FAB } from "react-native-paper";
const people = [
  { id: "1", title:"Akshat",imageName:"Akshat", amount: "₹60", time: "3 unsettled splits" ,optionText:"You Owe",transactionType:"income"},
  { id: "2",title:"Atharva",imageName:"Atharva",amount: "₹90", time: "2 unsettled splits" ,optionText:"You are Due",transactionType:"expense"},
  { id: "3", title:"ABC",imageName:"ABC", amount: "₹80", time: "5 unsettled splits" ,optionText:"You Owe",transactionType:"income"},
];
// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";
export default function PeopleScreen() {
  const router = useRouter();
  const {group_id,group_name} = useLocalSearchParams();
  const {data: dataPeople, isLoading: isLoadingPeople, error: errorPeople} = useGetUserExchangeStateInGroupQuery({group_id});
   const [remindBorrower, {isLoading: loadingBorrowReq}] = useRemindUserBorrowerMutation();
 
  if (isLoadingPeople) {
      return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
    }
    
    if (errorPeople) {
      return <Text>Error: {errorPeople?.message || JSON.stringify(errorPeople)}</Text>;
    }
  const people = dataPeople.data;
  const numberOfPeople = people.length;
const handleRemind = async (id) => {
      try {
        const response = await remindBorrower({borrower_id: id}).unwrap();
        Alert.alert(
          "Remainder Sent", 
          "A remainder has been sent", 
          [
            { text: "ok", style: "cancel" },
          ]
        )
      } catch (error) {
        console.error("Error sending borrowers mail:", error);
        const err = error as { data?: { message?: string } };
        Alert.alert(
          "Remainder Error", 
          `${err?.data?.message}`, 
          [
            { text: "ok", style: "cancel" },
          ]
        )
      }
    };
  return (
    <View style={[{flex:1}]}>
        <ScrollView style={globalStyles.viewContainer}>   
          <View style = {globalStyles.viewHeader}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.back()} style={globalStyles.backButton}/>
            <Text style={globalStyles.headerText}>{group_name}</Text>
          </View>
          <View style={styles.transactionsContainer}>
          {numberOfPeople>0?(<FlatList
              data={people}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style = {styles.memberContainer}>
                <TransactionCard
                // pressFunction = {() => router.push({ pathname: "/viewPeople", params: {id: item._id, amount: item.amount} })}
                imageName={item?.other_member_profile_photo}
                title = {item.other_member_name}
                amount={`₹${item.amount}`}
                subtitle={undefined}
                optionText={item.exchange_status === "lended" ? "You lend" : item.exchange_status === "borrowed" ? "You owe" : "Settled"}
                transactionType={item.exchange_status === "lended" ? "income" : item.exchange_status === "borrowed" ? "expense" : "settled"}
                />
                {(item.exchange_status === "lended" || item.exchange_status === "borrowed") && (
                    <View style={styles.buttonContainer}>
                        {item.exchange_status==="lended" &&(<TouchableOpacity 
                        style={styles.remindButton}
                        onPress={() => 
                            Alert.alert(
                            "Remind All", 
                            `This will send a remainder email to ${item.other_member_name}!`, 
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "Yes", onPress: () => handleRemind(item.other_member_id)}
                            ]
                            )
                        }
                        >
                        <Text style={styles.buttonText}>Remind</Text>
                        </TouchableOpacity>)}
                        <TouchableOpacity 
                        style={styles.settleButton} 
                        onPress={() => router.push({ 
                            pathname: "/action/create/createSettlement", 
                            params: { 
                            fetched_amount: item.exchange_status === "lended" ? item.amount : item.amount*-1, 
                            receiver_id: item.other_member_id, 
                            name: item.other_member_name ,
                            group_id:group_id,
                            group_name:group_name,
                            } 
                        })}
                        >
                        <Text style={styles.buttonText}>Settle Up</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                </View>
              )}
              ItemSeparatorComponent={() => (
                <View style={{  height: 10 , backgroundColor: 'white'}} />
              )}
              contentContainerStyle={{ paddingBottom: 5 }}  // Ensure no extra padding

            />):
            <Text style = {styles.noPeopleText}>No people found</Text>
            }
          </View>
        </ScrollView>
        </View>
  );
}

const styles = StyleSheet.create({
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
  },
buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center align buttons horizontally
    // marginTop: -1,
    marginBottom:10,
    backgroundColor: "#f8f9fa",
    // paddingVertical: 10, // Add padding for better spacing
  },
  remindButton: {
    backgroundColor: "#475569",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  settleButton: {
    backgroundColor: "#047857",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
  memberContainer:{
    backgroundColor:"#f8f9fa",
  },
  groupName:{
    alignSelf:"center",
    fontSize:20,
  }
});