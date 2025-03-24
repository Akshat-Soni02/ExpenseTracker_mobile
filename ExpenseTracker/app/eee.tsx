import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { useLazyGetUserByIdQuery } from "@/store/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyGetWalletQuery } from "@/store/walletApi";
import { useGetExpenseQuery } from "@/store/expenseApi";

const EeDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetExpenseQuery(id);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);


//   const expense = expenseData.data;


  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading expense details</Text>;
//   if (!expenseData?.data) return <Text>No expense found</Text>;


  return (
    <View style={[styles.container]}>
      
    </View>
  );
};

export default EeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderWidth: 2,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  menuButton: {
    padding: 10,
  },
  detailContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  amount: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
  },
  accountName: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  date: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
  notesContainer: {
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  notesTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#374151",
  },
  notesText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  splitContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 15,
  },
  paidBy: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#374151",
    marginBottom: 5,
  },
  oweText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  boldText: {
    fontFamily: "Poppins_700Bold",
  },
});