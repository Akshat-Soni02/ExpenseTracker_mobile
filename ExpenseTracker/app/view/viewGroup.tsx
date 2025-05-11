import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, TextInput, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { FAB, PaperProvider } from 'react-native-paper';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useGetGroupQuery, useGetGroupHistoryQuery } from "@/store/groupApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import PeopleScreen from "../../components/groupSettlements";

const GroupDetailsScreen = () => {

  const { id } = useLocalSearchParams() as {id: string};

  const [state, setState] = React.useState({ open: false });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data, isLoading, error, refetch } = useGetGroupQuery(id);
  const { data: history, isLoading: loading, error: historyError } = useGetGroupHistoryQuery(id);
  const [activeTab, setActiveTab] = useState<"history" | "settle">("history");

  const { open } : { open : boolean} = state;
  const onStateChange = ({ open } : { open : boolean}) => setState({ open });


  const group = data?.data;
  let settleUpDuration = group && group.settle_up_date ? daysUntilDate(group.settle_up_date) : null;
  const currSpent = history
  ? history.data.reduce((acc, trans) => {
      return trans.type === "expense" ? acc + trans.total_amount : acc;
    }, 0)
  : 0;

  const historyData = history?.data || [];

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);


   function daysUntilDate(input: Date): string {
    const today = new Date();
    const inputDate = new Date(input);

    const inputMidnight = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = inputMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 0) {
      return "Settled up";
    } else if (diffDays === 0) {
      return "Settle up today";
    } else {
      return `Settle up in ${diffDays} days`;
    }
  }  

  const groupedByMonth = history?.data?.reduce((acc, item) => {
    const date = item.created_at_date_time || item.createdAt;
    if (!date) return acc;
  
    const monthKey = moment(date).format("MMMM YYYY");
  
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
  
    acc[monthKey].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const months = Object.keys(groupedByMonth || {}).sort((a, b) =>
    moment(b, "MMMM YYYY").valueOf() - moment(a, "MMMM YYYY").valueOf()
  );

  if (isLoading || loading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (error) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in error) {
      errorMessage = `Server Error: ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      errorMessage = `Client Error: ${error.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }
  
  if (!data?.data) return <Text>No group found</Text>;
  return (
    <PaperProvider>

    <View style={{flex:1}}>
    <View style={globalStyles.viewContainer}>

      {/* Header */}
     <Header headerIcon={
        <Ionicons name="settings-outline" size={20} color="black" onPress={() => router.push({pathname: "/misc/groupSettings", params: {id: group?._id, budget: group?.initial_budget?.toString(), members: JSON.stringify(group?.members)}})}/>
      }/>

      {/* Group Info */}
      <View style={styles.groupInfo}>

        <View style = {styles.groupUpperInfo}>
          <View style={styles.mandatory}>
            <Text style={styles.groupName}>{group?.group_title}</Text>
          </View>

          <View style={styles.optional}>

            {group?.settle_up_date && (
              <View style={styles.fieldContainer}><Octicons name="calendar" size={20} color="#707070" /><Text style={styles.optionalField}>{settleUpDuration}</Text></View>
            )}

          </View>

        </View>

        {group?.initial_budget && (
          <View>
            <Text>Spent: <Text style={{color: "#3758f9"}}>₹{currSpent}</Text> | Budget: <Text style={{color: "#3758f9"}}>₹{group.initial_budget}</Text></Text>
            <ProgressBar current={currSpent} total={group.initial_budget} showLabel={false}/>
          </View>
        )}

      </View>

      <View style={styles.buttonContainer}>

        <TouchableOpacity 
          style={activeTab === "history" ? styles.selecTab : styles.unselecTab} 
          onPress={() => setActiveTab("history")}
        >
          <Text style={activeTab === "history" ? styles.buttonSelText : styles.buttonUnselText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={activeTab === "settle" ? styles.selecTab : styles.unselecTab} 
          onPress={() => setActiveTab("settle")}
        >
          <Text style={activeTab === "settle" ? styles.buttonSelText : styles.buttonUnselText}>Settle Up</Text>
        </TouchableOpacity> 

      </View>

    {activeTab === "history" ? (
        <ScrollView>
        {/* Expense List */}
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : history?.data && history?.data?.length > 0 ? (
          <View style={{ paddingBottom: 20 }}>
            {months.map((month) => (
              <View key={month} style={{ backgroundColor: "white" }}>
                <Text style={styles.sectionTitle}>{month}</Text>
        
                <FlatList
                  data={groupedByMonth[month]}
                  keyExtractor={(item, index) => item._id ?? index.toString()}
                  renderItem={({ item }) => {
                    if (item.type === "expense") {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            router.push({
                              pathname: "/view/viewExpense",
                              params: { id: item._id },
                            })
                          }
                          style={styles.expenseRow}
                        >
                          <View style={styles.expenseTextContainer}>
                            <Text style={styles.expenseDescription} numberOfLines={1}>
                              {item?.description || "No description"}
                            </Text>
                            <Text style={styles.expenseCategory}>
                              Paid by {item?.giver}
                            </Text>
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
                                { color: "black", fontWeight: "400" },
                              ]}
                            >
                              ₹{Math.abs(item?.total_amount?.toFixed(2) || 0)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    } else if (item.type === "settlement") {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            router.push({
                              pathname: "/view/viewSettlement",
                              params: { id: item._id },
                            })
                          }
                          style={styles.settlementRow}
                        >
                          <View style={styles.expenseTextContainer}>
                            <Text style={styles.settlementText} numberOfLines={1}>
                              {item?.settlement_description || "Settlement"}
                            </Text>
                            <Text style={styles.expenseCategory}>
                              Settled by {item?.giver}
                            </Text>
                          </View>
                          <View style={styles.expenseAmountContainer}>
                            <Text style={styles.expenseDate}>
                              {item?.createdAt
                                ? moment(item.createdAt).format("DD MMM, hh:mm A")
                                : "Unknown Date"}
                            </Text>
                            <Text style={styles.settlementAmount}>
                              ₹{Math.abs(item?.amount?.toFixed(2) || 0)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                    return null;
                  }}
                  ItemSeparatorComponent={() => (
                    <View style={{ height: 5, backgroundColor: "white" }} />
                  )}
                  contentContainerStyle={{ paddingBottom: 5 }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ))}
          </View>
        ) : (
          <Text style={globalStyles.noText}>No history</Text>
        )}
      </ScrollView>
    ): (
      <PeopleScreen group_id={group?._id} group_name={group?.group_title}/>
    )}
    
    </View>
      <FAB
        icon={({ size, color }) => (
          <Ionicons name="add" size={size} color={color} />
        )}
        style={globalStyles.fab}
        onPress={() => router.push({ pathname: "/action/create/createExpense", params: { group_id: group?._id, group_name: group?.group_title } })}
        />
    </View>
  </PaperProvider>

  );
};

export default GroupDetailsScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 20,},
  searchInput: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 10 },
  modalItem: { paddingVertical: 15, flexDirection: "row", width: "100%", paddingHorizontal: 10 },
  selectedItem: { backgroundColor: "rgba(111, 187, 250, 0.24)" },
  modalItemText: { fontSize: 16 },
    paidByContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    alignSelf: "center",
  },
  menuButton: {
    padding: 10,
  },
  settlementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  
  settlementText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
    paddingRight: 10,
  },
  
  settlementAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#047857",
  },
  
  groupInfo: {
    padding: 20,
    backgroundColor: "#EDF2FB",
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    justifyContent: "space-between",
    gap: 20
  },
  groupUpperInfo: {
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
    color: "#1E1E1E",
  },
  groupDetails: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 2,
  },
  optionalField: {
    fontSize: 18,
    color: "#707070",
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  
  expenseTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  
  expenseDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827", 
    marginBottom: 2,
  },
  
  expenseCategory: {
    fontSize: 12,
    color: "#6B7280",
  },
  
  expenseAmountContainer: {
    alignItems: "flex-end",
  },
  
  expenseDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  
  expenseAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
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
    backgroundColor: "#475569",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 6,
  },
  
  
  settleButton: {
    flex: 1,
    backgroundColor: "#047857",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 6,
  },
  buttonSelText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "400",
  },
  buttonUnselText: {
    color: "#343f4f",
    fontSize: 16,
    fontWeight: "400",
  },
  selecTab: {
    flex: 1,
    backgroundColor: "#343f4f",
    color: "#FFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 6,
    fontWeight: "200"
  },

  unselecTab: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    color: "#343f4f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 6,
  }
  

  
});
