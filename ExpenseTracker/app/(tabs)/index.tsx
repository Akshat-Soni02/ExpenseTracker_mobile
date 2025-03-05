import { StyleSheet ,ScrollView,View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
// import {  View } from '@/components/Themed';
import { useRouter } from "expo-router";
import ImageIcon from '@/components/ImageIcon';
import * as React from 'react';
// import { Card, Text } from 'react-native-paper';
import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const transactions = [
  { id: "1", type: "expense", amount: "₹60", time: "6:16 pm · 19 Feb" },
  { id: "2", type: "income", amount: "₹90", time: "6:16 pm · 19 Feb" },
  { id: "3", type: "expense", amount: "₹80", time: "6:16 pm · 19 Feb" },
];

const groups = ["AnyGroupA", "AnyGroupB", "AnyGroupC"];

export default function TabOneScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileColumn}>
          <View style={styles.profileInfo}>
            <Image
              source={require("../../assets/images/sampleprofilepic.png")}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Good afternoon</Text>
              <Text style={styles.name}>Adline Castelino</Text>
            </View>
          </View>
        </View>
        <View style={styles.totalSpend}>
          <View>
            <Text style={styles.label}>Today's Spend</Text>
            <Text style={styles.spend}>₹5000</Text>
          </View>
        </View>
        <View style={styles.profileColumn}>
          <View style={styles.financialSummary}>
            <View>
              <Text style={styles.label}>You owe</Text>
              <Text style={styles.debit}>₹500</Text>
            </View>
            <View>
              <Text style={styles.label}>You lended</Text>
              <Text style={styles.credit}>₹1000</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        {["add", "swap-horizontal", "receipt", "wallet"].map((icon, index) => (
          <TouchableOpacity key={index} style={styles.actionButton}>
            <Ionicons name={icon} size={24} color="#000" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions */}
      <Text style={styles.sectionTitle}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Ionicons
              name={item.type === "expense" ? "arrow-up" : "arrow-down"}
              size={20}
              color={item.type === "expense" ? "red" : "green"}
            />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>Paytmqr28100743...</Text>
              <Text style={styles.transactionTime}>{item.time}</Text>
            </View>
            <Text style={styles.transactionAmount}>{item.amount}</Text>
          </View>
        )}
      />

      {/* Groups */}
      <Text style={styles.sectionTitle}>Groups</Text>
      <View style={styles.groupContainer}>
        {groups.map((group, index) => (
          <View key={index} style={styles.groupItem}>
            <Text style={styles.groupLetter}>{group.charAt(0)}</Text>
            <Text style={styles.groupName}>{group}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.newGroup}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f8f9fa" 
  },
  profileCard: { 
    // flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 20, 
    borderRadius: 10, 
    backgroundColor: "#2C3E50", 
    marginBottom: 20 
  },

  profileInfo: { 
    flexDirection: "row",  
  },
  profileColumn: { 
    flexDirection: "column", 
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 10, 
  },
  greeting: { 
    color: "#fff", 
    fontSize: 12,
  },
  name: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  financialSummary: { 
    alignItems: "flex-end" 
  },
  totalSpend: {
    alignItems: "flex-end",
    marginTop: 10,},
  label: { 
    color: "#ccc", 
    fontSize: 12 
  },
  debit: { 
    color: "red", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  credit: { 
    color: "green", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  spend:{
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actions: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 20 
  },
  actionButton: { 
    backgroundColor: "#EAF2FF", 
    padding: 15, 
    borderRadius: 10 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  transactionItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    marginBottom: 10 
  },
  transactionDetails: { 
    flex: 1,
    marginLeft: 10 
  },
  transactionTitle: { 
    fontSize: 16 
  },
  transactionTime: { 
    color: "#888", 
    fontSize: 12 
  },
  transactionAmount: { 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  groupContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10 
  },
  groupItem: { 
    alignItems: "center" 
  },
  groupLetter: { 
    fontSize: 20, 
    fontWeight: "bold", 
    backgroundColor: "#D1E7FF", 
    padding: 15, 
    borderRadius: 50 
  },
  groupName: { 
    fontSize: 12, 
    marginTop: 5 
  },
  newGroup: { 
    backgroundColor: "#D1E7FF", 
    padding: 15, 
    borderRadius: 50, 
    alignItems: "center" 
  },
});