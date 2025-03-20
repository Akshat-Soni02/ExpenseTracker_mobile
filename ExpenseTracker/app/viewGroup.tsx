import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useGetGroupQuery, useGetGroupHistoryQuery } from "@/store/groupApi";
import moment from "moment";

const GroupDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetGroupQuery(id);
  const { data: history, isLoading: loading, error: historyError } = useGetGroupHistoryQuery(id);
  const group = data?.data;
  const totalMembers = group?.members.length;
//   console.log("history:", history.data);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  if (isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  if (error) return <Text>Error loading group details</Text>;
  if (!data?.data) return <Text>No group found</Text>;

  if (historyError) {
    return <Text>Error fetching history</Text>;
  }
  if(loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={22} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({pathname:"/editGroup",params:{id:id}})}>
          <Ionicons name="settings-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* Group Info */}
      <View style={styles.groupInfo}>
        <View style={styles.mandatory}>
          <Text style={styles.groupName}>{group.group_title}</Text>
          <Text style={styles.groupDetails}>{totalMembers} Members</Text>
        </View>
        <View style={styles.optional}>
          {group.initial_budget && (
            <Text style={styles.optionalField}>Estimated Budget: ₹{group.initial_budget}</Text>
          )}
          {group.settle_up_date && (
            <Text style={styles.optionalField}>Settle-Up Date: {moment(group.settle_up_datemoment).format("DD MMM, YYYY")}</Text>
          )}
        </View>
      </View>

      {/* Expense List */}
      {loading ? (
        <ActivityIndicator color="#000" />
        ) : history?.data && history.data.length > 0 ? (
        <FlatList
            data={history.data} // Ensure data exists
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push({ pathname: "/viewExpense", params: {id: item._id} })}>
                    <View style={styles.expenseRow}>
                        <View style={styles.expenseTextContainer}>
                        <Text style={styles.expenseDescription} numberOfLines={1}>
                            {item?.description || "No description"}
                        </Text>
                        <Text style={styles.expenseAccount}>{item?.expense_category || "Unknown"}</Text>
                        </View>
                        <View style={styles.expenseAmountContainer}>
                        <Text style={styles.expenseDate}>
                            {item?.created_at_date_time
                            ? moment(item.created_at_date_time).format("DD MMM, hh:mm A")
                            : "Unknown Date"}
                        </Text>
                        <Text
                            style={[
                            styles.expenseAmount,
                            { color: item?.total_amount < 0 ? "red" : "green" },
                            ]}
                        >
                            {item?.total_amount > 0 ? "+" : ""}₹{Math.abs(item?.total_amount || 0)}
                        </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
        />
        ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No expenses found</Text>
        )}

      {/* Floating Add Expense Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <Ionicons name="add" size={24} color="#fff" onPress={() => router.push({ pathname: "/addSplit", params: { group_id: group._id, group_name: group.group_title } })}/>
      </TouchableOpacity>
    </View>
  );
};

export default GroupDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  mandatory: {
    alignItems: "flex-start",
    gap: 5,
  },
  optional: {
    alignItems: "flex-end",
    gap: 5,
  },
  groupInfo: {
    padding: 18,
    backgroundColor: "#4A627A",
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  groupDetails: {
    fontSize: 14,
    color: "white",
    marginTop: 2,
  },
  optionalField: {
    fontSize: 14,
    color: "#D1D5DB",
    marginTop: 4,
  },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  expenseTextContainer: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  expenseAccount: {
    fontSize: 12,
    color: "#6B7280",
  },
  expenseAmountContainer: {
    alignItems: "flex-end",
  },
  expenseDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});