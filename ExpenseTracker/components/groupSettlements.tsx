import { StyleSheet, ScrollView, FlatList, ActivityIndicator, Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useRemindUserBorrowerMutation } from '@/store/userApi';
import { useGetUserExchangeStateInGroupQuery, GroupExchangeDetail } from '@/store/groupApi';
import { globalStyles } from "@/styles/globalStyles";

type LocalParams = {
  group_id: string;
  group_name: string;
};

export default function PeopleScreen({ group_id, group_name }: LocalParams) {
  const router = useRouter();

  const { data: dataPeople, isLoading: isLoadingPeople, error: errorPeople } = useGetUserExchangeStateInGroupQuery({ group_id });
  const [remindBorrower, { isLoading: loadingBorrowReq }] = useRemindUserBorrowerMutation();

  const people: GroupExchangeDetail[] = dataPeople?.data || [];

  const handleRemind = async (id: string, name: string) => {
    try {
      await remindBorrower({ borrower_id: id }).unwrap();
      Alert.alert("Reminder Sent", `Reminder email sent to ${name}.`);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      Alert.alert("Reminder Error", err?.data?.message || "Failed to send reminder.");
    }
  };

  if (isLoadingPeople) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#000" />
      </View>
    );
  }

  if (errorPeople) {
    const message = "status" in errorPeople
      ? `Server Error: ${JSON.stringify(errorPeople.data)}`
      : "message" in errorPeople
        ? `Client Error: ${errorPeople.message}`
        : "An unknown error occurred";
    return <Text style={globalStyles.pageMidError}>{message}</Text>;
  }

  const renderPerson = ({ item }: { item: GroupExchangeDetail }) => {
    const status = item.exchange_status;
    const isSettled = status === "settled";
    const amountColor =
      status === "lended" ? styles.income :
      status === "borrowed" ? styles.expense :
      styles.settled;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.name}>{item.other_member_name}</Text>
            <Text style={styles.status}>
              {status === "lended" ? "You lent them" :
               status === "borrowed" ? "You owe them" :
               "Settled"}
            </Text>
          </View>
          <Text style={[styles.amount, amountColor]}>
            ₹{item.amount.toFixed(2)}
          </Text>
        </View>

        {!isSettled && (
          <View style={styles.actionRow}>
            {status === "lended" && (
              <TouchableOpacity
                disabled={loadingBorrowReq}
                onPress={() =>
                  Alert.alert(
                    "Send Reminder",
                    `Send a reminder to ${item.other_member_name}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Yes", onPress: () => handleRemind(item.other_member_id, item.other_member_name) },
                    ]
                  )
                }
                style={styles.iconButton}
              >
                <MaterialCommunityIcons name="bell-ring-outline" size={20} color="#4B5563" />
                <Text style={styles.iconLabel}>Remind</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/action/create/createSettlement",
                  params: {
                    fetched_amount: status === "lended" ? item.amount : -item.amount,
                    receiver_id: item.other_member_id,
                    name: item.other_member_name,
                    group_id,
                    group_name,
                  },
                })
              }
              style={styles.iconButton}
            >
              <FontAwesome name="handshake-o" size={20} color="#4B5563" />
              <Text style={styles.iconLabel}>Settle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {people.length > 0 ? (
        <FlatList
          data={people}
          keyExtractor={(item) => item.other_member_id}
          renderItem={renderPerson}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <Text style={styles.noPeopleText}>No people found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "black"
  },
  status: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  income: {
    color: "#1e9738",
  },
  expense: {
    color: "#d86161",
  },
  settled: {
    color: "#9CA3AF",
  },
  actionRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-end"
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 18,
  },
  noPeopleText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: "#9CA3AF",
  },
});
