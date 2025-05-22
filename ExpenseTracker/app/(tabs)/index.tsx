import { StyleSheet ,View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, StatusBar,Pressable,Alert} from 'react-native';
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PaperProvider, Portal, Modal} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import TransactionCard from '@/components/readComponents/TransactionCard';
import { globalStyles } from '@/styles/globalStyles';
import { useGetUserCurrentExchangeStatusQuery, useGetUserDetectedTransactionsQuery,useGetUserGroupsQuery,useGetUserQuery,useUpdateUserAccessTokenMutation,useGetTodaySpendQuery } from '@/store/userApi';
import { Detected } from '@/store/detectedTransactionApi';
import { Group } from '@/store/groupApi';
import SkeletonPlaceholder from '@/components/skeleton/SkeletonPlaceholder';
// import useSMS from '@/app/misc/useSMS';

export const requestPermissionAndroid = async () => {
  const granted = await   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  if (granted === PermissionsAndroid.RESULTS.GRANTED) { 
    console.log("Notification permission granted");
    // getToken();
  } else {
    console.log("Notification permission denied");
  }
}

export default function HomeScreen() {
  const router = useRouter();
  // const { startReadCycle } = useSMS();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Detected | null>(null);
  // const { checkPermissions, requestReadSMSPermission } = useSMS();

  const { authToken, loading } = useAuth();
  const [updateUserAccessToken] = useUpdateUserAccessTokenMutation();
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  useEffect(() => {
    if (!loading && !authToken) {
      router.replace("/auth/welcome");
    }
  }, [authToken, loading]);

  // useEffect(() => {
  //   startReadCycle();
  // }, []);
  // useEffect(() => {
  //   const init = async () => {
  //     const hasSMSPermission = await checkPermissions();
  //     if (hasSMSPermission) {
  //       startReadCycle();
  //     }
  //   };
  //   init();
  // }, []);
  


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('🔥 FCM Foreground:', remoteMessage);
      Alert.alert(
        remoteMessage?.data?.title || 'Notification',
        remoteMessage?.data?.body || 'You have a new message!'
      );
    });
  
    return unsubscribe;
  }, []);

  const getToken = async () => {
    const token = await messaging().getToken();
    updateUserAccessToken({token:token});
    console.log("FCM Access Token:",token);
  }
  // useEffect(() => { ////Only if permission granted
  //   getToken();
  // }, []);
  useEffect(() => {
    const init = async () => {
      const hasNotificationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (hasNotificationPermission) {
        getToken();
      }
    };
    init();
  }, []);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#ffffff');
  }, []);

  const {data: dataUser, isLoading: isLoadingUser, error: errorUser} = useGetUserQuery();
  const {data: exchangeData, isLoading, error: errorExchange} = useGetUserCurrentExchangeStatusQuery();
  const {data:todaySpend, isLoading: isLoadingSpend,refetch, error: errorSpend} = useGetTodaySpendQuery();
  const {data:dataDetected, isLoading:isLoadingDetected, error: errorDetected} = useGetUserDetectedTransactionsQuery();
  const {data:dataGroup, isLoading:isLoadingGroup, error:errorGroup} = useGetUserGroupsQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // if (isLoadingDetected || isLoadingGroup || isLoadingUser || isLoading) {
  //   return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  // }

  if (errorUser) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorUser) {
      errorMessage = `Server Error: ${JSON.stringify(errorUser.data)}`;
    } else if ("message" in errorUser) {
      errorMessage = `Client Error: ${errorUser.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }


  // if (errorDetected || errorGroup || errorUser) {
  //   return <Text>Error: {errorDetected?.message || JSON.stringify(errorDetected) || errorGroup?.message || JSON.stringify(errorGroup) || errorUser?.message || JSON.stringify(errorUser)}</Text>;
  // }

  const groups: Group[] = dataGroup?.data || [];
  const numberofGroups: number = groups.length;

  const numberOfTransactions: number = dataDetected?.data?.length || 0;

  const openModal = (transaction:Detected) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const handleSelection = (option: "to Split" | "to Personal") => {
    if (option === "to Split") {
      router.push({ pathname: "/action/create/createExpense", params: {detectedId: selectedTransaction?._id, detectedAmount: selectedTransaction?.amount,detectedTransaction_type: selectedTransaction?.transaction_type,detectedDescription:selectedTransaction?.description,detectedFrom_account:selectedTransaction?.from_account,detectedTo_account:selectedTransaction?.to_account,detectedCreated_at_date_time:selectedTransaction?.created_at_date_time, detectedNotes:selectedTransaction?.notes} });
    } else if (option === "to Personal") {
      router.push({ pathname: "/action/create/createTransaction", params: {detectedId: selectedTransaction?._id, detectedAmount: selectedTransaction?.amount,detectedTransaction_type:selectedTransaction?.transaction_type,detectedDescription:selectedTransaction?.description,detectedFrom_account:selectedTransaction?.from_account,detectedTo_account:selectedTransaction?.to_account,detectedCreated_at_date_time:selectedTransaction?.created_at_date_time, detectedNotes:selectedTransaction?.notes} });
    }
    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <View style={styles.page}>
        <View style={styles.container}>

          {/* skeleton */}
          {isLoadingUser || isLoading || isLoadingSpend ? (
            <View style={styles.profileCard}>
              <View style={styles.profileColumn1}>
                <View style={styles.profileInfo}>
                  <SkeletonPlaceholder style={styles.avatar} />
                  <View style={{ marginLeft: 10 }}>
                    <SkeletonPlaceholder style={{ width: 100, height: 16, borderRadius: 4, marginBottom: 6 }} />
                    <SkeletonPlaceholder style={{ width: 150, height: 20, borderRadius: 4 }} />
                  </View>
                </View>
                <View style={styles.totalSpend}>
                  <SkeletonPlaceholder style={{ width: 100, height: 16, marginBottom: 6, borderRadius: 4 }} />
                  <SkeletonPlaceholder style={{ width: 60, height: 20, borderRadius: 4 }} />
                </View>
              </View>

              <View style={styles.profileColumn2}>
                <View style={styles.financialSummary}>
                  <View style={styles.textContainer}>
                    <SkeletonPlaceholder style={{ width: 80, height: 16, marginBottom: 6, borderRadius: 4 }} />
                    <SkeletonPlaceholder style={{ width: 70, height: 20, borderRadius: 4 }} />
                  </View>
                  <View>
                    <SkeletonPlaceholder style={{ width: 80, height: 16, marginBottom: 6, borderRadius: 4 }} />
                    <SkeletonPlaceholder style={{ width: 70, height: 20, borderRadius: 4 }} />
                  </View>
                </View>
              </View>
            </View>
          ) : (
              <View style={styles.profileCard}>

              <View style={styles.profileColumn1}>
                <TouchableOpacity style={styles.profileInfo} onPress={()=>router.push("/view/viewProfile")}>
                  {dataUser?.data?.profile_photo ? (<Image source={{ uri: dataUser.data.profile_photo.url }} style={styles.avatar} />) : ( <LinearGradient colors={["#FFFFFF", "#F3F4F6"]} style={styles.avatar} />)}
                  <View>
                    <Text style={styles.greeting}>Good afternoon</Text>
                    <Text style={styles.name}>{dataUser?.data?.name}</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.totalSpend}>
                  <View>
                    <Text style={styles.label}>Today's spend</Text>
                    <View style = {styles.rupeeContainer}><Text style={[styles.rupee, {color: "#fff"}]}>₹</Text><Text style={styles.spend}>{todaySpend?.data.todaySpend?.toString() || "0"}</Text></View>
                  </View>
                </View>
              </View>

              <View style={styles.profileColumn2}>

                <View style={styles.financialSummary}>

                  <View style={styles.textContainer}>
                    <Text style={styles.label}>You owe</Text>
                    {!isLoading && (<View style = {styles.rupeeContainer}><Text style={[styles.rupee, {color: "#ef6d6d"}]}>₹</Text><Text style={styles.debit}>{exchangeData?.data?.borrowedAmount?.toFixed(2)}</Text></View>)}
                  </View>

                  <View>
                    <Text style={styles.label}>You lend</Text>
                    {!isLoading && (<View style = {styles.rupeeContainer}><Text style={[styles.rupee, {color: "#7DDE92"}]}>₹</Text><Text style={styles.credit}>{exchangeData?.data?.lendedAmount?.toFixed(2)}</Text></View>)}
                  </View>
                  

                </View>
              </View>

            </View>
          )}
          


          {/* Quick Actions */}
          <View style={styles.actions}>
            {[
              { icon: "call-split", label: ["Split", "money"], route: "/action/create/createExpense" },
              { icon: "plus", label: ["Add", "Transaction"], route: "/action/create/createTransaction" },
              { icon: "file-check-outline", label: ["Bills"], route: "/(tabs)/bills" },
              // { icon: "finance", label: ["Budgets"], route: "/(tabs)/budgets" },
              { icon: "account-multiple", label: ["Groups"], route: "/(tabs)/groups" },
            ].map((item, index) => (
              <View key={index} style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => router.push(item.route)}>
                  <MaterialCommunityIcons name={item.icon} color="black" size={25} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                  {item.label.map((item1, i) => (
                    <Text key={i} style={styles.actionText}>{item1}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>



          {/* Transactions */}
          {isLoadingDetected ? (
            <>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Auto Transactions</Text>
                <SkeletonPlaceholder style={{ width: 60, height: 20, borderRadius: 4 }} />
              </View>

              {[...Array(3)].map((_, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <SkeletonPlaceholder style={{ height: 70, borderRadius: 10 }} />
                </View>
              ))}
            </>
          ) : (
            <>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Auto Transactions</Text>
                <Button style={styles.viewButton} onPress={() => router.push("/(tabs)/detectedTransactions")}>
                  View all
                </Button>
              </View>

              {numberOfTransactions > 0 ? (
                <FlatList
                  data={dataDetected?.data?.slice(0, 3)}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TransactionCard
                      pressFunction={() => openModal(item)}
                      title={item.description}
                      imageType={item.transaction_type}
                      amount={`₹${item.amount}`}
                      subtitle={moment(item.created_at_date_time).format("DD MMM YYYY, hh:mm A")}
                      transactionType={item.transaction_type}
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: 'white' }} />}
                  contentContainerStyle={{ paddingBottom: 0 }}
                />
              ) : (
                <Text style={styles.noTransactionsText}>No auto transactions for today</Text>
              )}
            </>
          )}

          

          {/* Groups */}
          <View style={styles.titleContainer}>
            <Text style={[styles.sectionTitle,{paddingTop:20}]} >Groups</Text>
            <Button style={styles.viewButton} onPress={()=>router.push("/(tabs)/groups")}>
                View all
            </Button>
          </View>

          <View style={styles.groupContainer}>
            {groups.slice(0, 3).map((group:any, index:any = group._id) => (
              <TouchableOpacity onPress={() => router.push({ pathname: "/view/viewGroup", params: { id:group._id} })} key={index}>
              <View key={index} style={styles.groupItem}>
                <Text style={styles.groupLetter}>{group.group_title.charAt(0)}</Text>
                <Text style={styles.groupName}>{group.group_title}</Text>
              </View>
              </TouchableOpacity>
            ))}
            <View style={styles.groupItem}>
              <TouchableOpacity style={styles.newGroup} onPress={() => router.push("/action/create/createGroup")}>
                <Ionicons name="add" size={24} color="#000" />          
              </TouchableOpacity>
              <Text style={styles.groupName}>Add</Text>
            </View>
          </View>

        </View>

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalView}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>Convert Auto Transaction</Text>
              {/* <Icon name="close" size={24} color="#333" onPress={() => setModalVisible(false)} style={{justifyContent: "flex-start"}}/> */}
            </View>

            {selectedTransaction?.transaction_type.toString()==="debit" && <Pressable style={styles.button} onPress={() => handleSelection("to Split")}>
                <Text style={styles.buttonText}>Split</Text>
              </Pressable>
            } 

            <Pressable style={styles.button} onPress={() => handleSelection("to Personal")}>
              <Text style={styles.buttonText}>Transaction</Text>
            </Pressable>

          </Modal>
        </Portal>

      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  page:{
    flex:1,
    backgroundColor: "#ffffff"
  },
  container: { 
    justifyContent:"space-between",
    padding: 20,      
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center",
    // paddingHorizontal: 16,
    paddingLeft: 16,
    // paddingVertical: 10,
    width: "100%",
    // backgroundColor: "red",
  },
  profileCard: { 
    flexDirection: "row", 
    justifyContent: "flex-start", 
    height:150,
    width:"100%",
    padding: 20, 
    borderRadius: 10, 
    backgroundColor: "#394b5e", 
    marginBottom: 20 
  },

  profileInfo: { 
    flexDirection: "row",
    alignItems: "center"
  },
  profileColumn1: { 
    width:"50%",
    justifyContent:"space-between",
    // flexDirection: "row", 
  },
  profileColumn2:{
    width:"50%",
    justifyContent:"flex-end",
    // flexDirection: "column", 
  },
  textContainer:{
    // marginBottom:10,
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 10,
    borderColor: "#FFFFFF40"
  },
  greeting: { 
    color: "#e7e7e7", 
    fontSize: 12,
  },
  name: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  financialSummary: { 
    alignSelf:"flex-end",
    gap: 20
  },
  totalSpend: {
    alignItems: "flex-start",
  },
  label: { 
    color: "#e7e7e7",
    fontSize: 14
  },
  rupee: {
    fontSize: 16, 
    fontWeight: "bold",
  },
  debit: { 
    color: "#ef6d6d", 
    fontSize: 17, 
    fontWeight: "bold",
  },
  rupeeContainer: {
    flexDirection: "row",
    gap: 2
  },
  credit: { 
    color: "#7DDE92", 
    fontSize: 17, 
    fontWeight: "bold" 
  },
  spend:{
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom:20,
  },
  actionContainer: {
    alignItems: "center",
    gap: 7
  },
  actionButton: {
    padding: 10,
    backgroundColor: "#C8E6FF",
    borderRadius: 50,
  },
  actionText: {
    // marginTop: 5,
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
    lineHeight: 14,
  },
  sectionTitle: { 
    fontSize: 18,
    // fontFamily: "Inter_700Bold",
    fontWeight: "500"
  },
  transactionItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    backgroundColor: "#f8f9fa", 
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
    marginTop: 5 ,
  },
  groupItem: { 
    alignItems: "center",
  },
  groupLetter: { 
    fontSize: 22, 
    fontWeight: "400", 
    backgroundColor: "#D1E7FF",  
    width:48,
    height:48,
    borderRadius: 50 ,
    textAlign: "center",
    textAlignVertical: "center",
  },
  groupName: { 
    fontSize: 12, 
    marginTop: 5,
    fontWeight: "500"
  },
  newGroup: { 
    backgroundColor: "#D1E7FF", 
    padding: 12, 
    borderRadius: 50, 
    alignItems: "center" 
  },
  titleContainer:{
    justifyContent:"space-between",
    flexDirection:"row"
  },
  viewButton:{
    alignSelf:"flex-end"
  }, 
  noTransactionsText: {
    height: 150, // Set a fixed height to match the expected space
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    textAlign: 'center', // Center the text
    fontSize: 16, // Adjust font size as needed
    color: 'gray', // Change color to indicate no transactions
    padding: 16, // Add some padding for better spacing
    textAlignVertical: "center"
},

modalView: {
  position: "absolute",
  top: "50%", // Position in the middle of the screen
  left: "50%", // Position in the middle horizontally
  transform: [{ translateX: -150 }, { translateY: -100 }], // Shift back by half width/height
  width: 300, // Fixed width to avoid stretching
  backgroundColor: "white",
  padding: 25,
  borderRadius: 15,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 6,
},
modalContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for better focus
},

modalText: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 15,
  textAlign: "center",
},
button: {
  width: "100%",
  padding: 14,
  marginVertical: 8,
  backgroundColor: "#f8f9fa",
  borderRadius: 10,
  alignItems: "center",
},
cancelButton: {
  backgroundColor: "#a94442", // Red for cancel to indicate action
},
buttonText: {
  color: "black",
  fontSize: 16,
  fontWeight: "500",
},
});