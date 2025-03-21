import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useGetUserByIdQuery } from "@/store/userApi";

const ViewPeopleScreen = () => {
    const {id, amount} = useLocalSearchParams();
  const { data, isLoading } = useGetUserByIdQuery(id);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!data || !data.data) {
    console.log(id);
    console.log(data);
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>User data not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          {data.data.profile_photo ? (
            <Image source={{ uri: data.data.profile_photo.url }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage} />
          )}
          <Text style={styles.name}>{data.data.name}</Text>
          <Text style={styles.email}>{data.data.email}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.remindButton}>
            <Text style={styles.buttonText}>Remind</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settleButton} onPress = {() => router.push({ pathname: "/createSettlement", params: { fetched_amount:amount,receiver_id : id,name: data.data.name } })}>
            <Text style={styles.buttonText}>Settle Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Debt Summary */}
      <View style={styles.summaryContainer}>
        {amount >= 0 ? (
          <Text style={styles.summaryText}>
            You lend <Text style={styles.greenAmount}>₹{amount}</Text> to {data.data.name}
          </Text>
        ) : (
          <Text style={styles.summaryText}>
            You owe <Text style={styles.redAmount}>₹{Math.abs(amount)}</Text> to {data.data.name}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ViewPeopleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#EF4444",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    padding: 10,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D5DB",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  email: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  remindButton: {
    backgroundColor: "#FBBF24",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  settleButton: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
  summaryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    color: "#111827",
  },
  redAmount: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#EF4444",
  },
  greenAmount: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "green",
  },
});