import { StyleSheet, Image,ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { MaterialCommunityIcons,FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

// import sampleProfilePic from "/Users/atharva.lonhari/Documents/Project_ET_Mobile/ExpenseTracker_mobile/ExpenseTracker/assets/images/sampleprofilepic.png";
export default function PeopleScreen() {
  const router = useRouter();


  return (
        <ScrollView style={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>      
          <Text style={styles.headerText}>People</Text>
          <View style={styles.transactionsContainer}>
            <TransactionCard
              imageName="sampleProfilePic"
              title="A Random Name"
              subtitle="3 unsettled splits"
              amount="$100"
              optionText="you owe"
            />
            <TransactionCard
              imageName="sampleProfilePic"
              title="A Random Name"
              subtitle="3 unsettled splits"
              amount="$100"
              optionText="you owe"
            />
            <TransactionCard
              imageName="sampleProfilePic"
              title="A Random Name"
              subtitle="3 unsettled splits"
              amount="$100"
              optionText="you owe"
            />
          </View>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 0, // Add padding to the top to avoid overlap with status bar
  },
  backButton: {
    // position: "absolute",
    left: 10,
    top: 20, // Space above the back button
    marginBottom: 20, // Space below the back button
  },
  headerText: {
    position: "absolute",
    top: 20, // Space above the header text
    fontSize: 22,
    right: 10,
    fontWeight: "bold",
    marginBottom: 20, // Space below the header text
  },
  transactionsContainer: {
    marginTop: 20, // Space above the transactions
    alignItems: "flex-start",
    width: "100%",
    paddingVertical: 10, // Space above and below the transactions
  },
});