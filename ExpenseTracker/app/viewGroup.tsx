import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useGetGroupQuery, useGetGroupHistoryQuery } from "@/store/groupApi";
import moment from "moment";
import { useRemindAllGroupBorrowersMutation ,useLazyLeaveGroupQuery,  useSimplifyDebtsMutation} from "@/store/groupApi";
import { FAB, Portal, PaperProvider } from 'react-native-paper';

const GroupDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetGroupQuery(id);
  const { data: history, isLoading: loading, error: historyError } = useGetGroupHistoryQuery(id);
  const [remindAll, {isLoading: loadingBorrowReq}] = useRemindAllGroupBorrowersMutation();
  const [leaveGroup, { isFetching, error:leaveError }] = useLazyLeaveGroupQuery();
  const [simplifyDebts, {isLoading: loadingSimplify}] = useSimplifyDebtsMutation();

  const [state, setState] = React.useState({ open: false });

  const group = data?.data;
  const totalMembers = group?.members.length;

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  if (isLoading) return <View style={styles.loadingContainer}><ActivityIndicator color="#000" /></View>;
  if (error) return <Text>Error loading group details</Text>;
  if (!data?.data) return <Text>No group found</Text>;
  if (historyError) return <Text>Error fetching history</Text>;
  if (loading) return <Text>Loading...</Text>;

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const handleRemindAll = async () => {
    try {
      const response = await remindAll({group_id: id}).unwrap();
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
  const handleLeaveGroup = async () => {
    try {
      await leaveGroup({ groupId:id }).unwrap();
      router.push("/(tabs)");
    } catch (err) {
      console.error("Error leaving group:", err);
    }
  };


  const onSimplifyDebts = async () => {
    try {
      await simplifyDebts( id ).unwrap();
      refetch();
    } catch (err) {
      console.error("Error leaving group:", err);
    }
  };
  return (
    <PaperProvider>

    <View style={{flex:1}}>
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
            <Text style={styles.optionalField}>Budget: ₹{group.initial_budget}</Text>
          )}
          {group.settle_up_date && (
            <Text style={styles.optionalField}>Settle-Up: {moment(group.settle_up_date).format("DD MMM, YYYY")}</Text>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.remindButton} 
          onPress={() => 
            Alert.alert(
              "Remind All", 
              "This will send a remainder email to all your borrowers in the group!", 
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => handleRemindAll()}
              ]
            )
          }
        >
          <Text style={styles.buttonText}>Remind All</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settleButton} 
          onPress={() => router.push({ pathname: "/groupSettlements", params: { group_id: group._id,group_name:group.group_title } })}
        >
          <Text style={styles.buttonText}>Settle Up</Text>
        </TouchableOpacity>
      </View>


      {/* Expense List */}
      {loading ? (
        <ActivityIndicator color="#000" />
      ) : history?.data && history.data.length > 0 ? (
        <FlatList
          data={history.data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/viewExpense", params: { id: item._id } })}
              style={styles.expenseRow}
            >
              <View style={styles.expenseTextContainer}>
                <Text style={styles.expenseDescription} numberOfLines={1}>
                  {item?.description || "No description"}
                </Text>
                <Text style={styles.expenseCategory}>{item?.expense_category || "Unknown"}</Text>
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
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noExpensesText}>No expenses found</Text>
      )}

      {/* Floating Add Expense Button */}
      {/* <TouchableOpacity style={styles.floatingButton} onPress={() => router.push({ pathname: "/addSplit", params: { group_id: group._id, group_name: group.group_title } })}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity> */}
      
    </View>
    <Portal>
      <FAB.Group
        open={open}
        visible
        icon={open ? 'close' : 'plus'}
        actions={[
          // { icon: 'plus', onPress: () => console.log('Pressed add') },
          {
            icon: 'currency-inr',
            label: 'Add Split',
            onPress: () => router.push({ pathname: "/addSplit", params: { group_id: group._id, group_name: group.group_title } }),
          },
          {
            icon: 'account-minus',
            label: 'Leave Group',
            onPress:handleLeaveGroup,
          },
          {
            icon: 'graphql',
            label: 'Simplify Debts',
            onPress: onSimplifyDebts,
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </Portal>
  </View>
  </PaperProvider>

  );
};

export default GroupDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  groupInfo: {
    padding: 18,
    backgroundColor: "#E3E8EF", // Lightened Header
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  mandatory: {
    alignItems: "flex-start",
    gap: 5,
  },
  optional: {
    alignItems: "flex-end",
    gap: 5,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
  },
  groupDetails: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  optionalField: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  expenseTextContainer: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  expenseCategory: {
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
  noExpensesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6B7280",
  },
  ////
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  
  remindButton: {
    flex: 1,
    backgroundColor: "#475569", // Slate Gray
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 6,
  },
  
  
  settleButton: {
    flex: 1,
    backgroundColor: "#047857", // Deep emerald green
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 6,
  },
  
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  

  
});
