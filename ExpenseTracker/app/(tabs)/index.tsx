import { StyleSheet ,View, Text, Image, FlatList, TouchableOpacity,Dimensions, ActivityIndicator, StatusBar,Pressable,Alert, ScrollView} from 'react-native';
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
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import TransactionCard from '@/components/readComponents/TransactionCard';
import { globalStyles } from '@/styles/globalStyles';
import { useGetUserCurrentExchangeStatusQuery, useGetUserDetectedTransactionsQuery,useGetUserGroupsQuery,useGetUserQuery,useUpdateUserAccessTokenMutation,useGetTodaySpendQuery } from '@/store/userApi';
import { Detected } from '@/store/detectedTransactionApi';
import { Group } from '@/store/groupApi';
import SkeletonPlaceholder from '@/components/skeleton/SkeletonPlaceholder';
import CircleCollapseLoader from '@/components/pageLoader';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS } from '../utils/constants';
import { testStyles } from '@/styles/test';
import { formatCurrency } from '../utils/helpers';
import { Bill, useGetMonthlyPendingBillsQuery } from '@/store/billApi';
import { formatDate } from '../utils/dateUtils';

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
    // StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }, []);

  const {data: dataUser, isLoading: isLoadingUser, error: errorUser} = useGetUserQuery();
  const {data: dataPendingBills, isLoading: isLoadingBills, error: errorBill} = useGetMonthlyPendingBillsQuery();
  const {data: exchangeData, isLoading, error: errorExchange} = useGetUserCurrentExchangeStatusQuery();
  const {data:todaySpend, isLoading: isLoadingSpend,refetch, error: errorSpend} = useGetTodaySpendQuery();
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

  const recentGroup = groups[0];
  const pendingBills: Bill[] = dataPendingBills?.data || [];





  const HomeHeader = () => {
    return (
      // <LinearGradient
      //   colors={['#E4F4FF', '#F7FBFF', '#FFFFFF']}
      //   start={{ x: 0.5, y: 0 }}
      //   end={{ x: 0.5, y: 1 }}
      //   style={test.headerContainer}
      // >
        <View style={test.headerContainer}>
        {/* Top Section Animates In */}
        <Animatable.View
          animation={"fadeIn"}
          delay={150}
          duration={150}
          style={{
            gap: 20,
          }}
        >
          {/* Avatar + Greeting */}
          <TouchableOpacity
            onPress={() => router.push("/view/viewProfile")}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {dataUser?.data?.profile_photo ? (
              <Image
                source={{ uri: dataUser.data.profile_photo.url }}
                style={[test.userAvatar, {backgroundColor: '#F3F4F6'}]}
              />
            ) : (
              <LinearGradient
                colors={["#FFFFFF", "#F3F4F6"]}
                style={test.userAvatar}
              />
            )}
            <Text style={test.greeting} numberOfLines={1}>
              Hi, {dataUser?.data?.name}
            </Text>
          </TouchableOpacity>

          {/* Financial Info */}
          <View
            style={[test.financeStats, screenWidth < 800 && {gap: 20}]}
          >
            {/* You Owed */}
            <View style={{ gap: 2 }}>
              <Text style={test.financeStatLabel}>You owed</Text>

              {!isLoading && (
                <View style={test.financeStatAmountContainer}>
                  <Text style={[test.financeStatAmount, {color: COLORS.amount.positive}, screenWidth < 800 && {fontSize: FONTS.large}]}>₹</Text>
                  <Text style={[test.financeStatAmount, {color: COLORS.amount.positive}, screenWidth < 800 && {fontSize: FONTS.large}]}>
                    {formatCurrency(exchangeData?.data?.lendedAmount)}
                  </Text>
                </View>
              )}

            </View>

            {/* You Owe */}
            <View style={{ gap: 2 }}>
              <Text style={test.financeStatLabel}>You owe</Text>

              {!isLoading && (
                <View style={test.financeStatAmountContainer}>
                  <Text style={[test.financeStatAmount, {color: COLORS.amount.negative}, screenWidth < 800 && {fontSize: FONTS.large}]}>₹</Text>
                  <Text style={[test.financeStatAmount, {color: COLORS.amount.negative}, screenWidth < 800 && {fontSize: FONTS.large}]}>
                    {formatCurrency(exchangeData?.data?.borrowedAmount)}
                  </Text>
                </View>
              )}

            </View>
          </View>

        </Animatable.View>

        {/* Decorative Illustration at right */}
        <Image
          source={require("../../assets/images/home-header1.png")}
          style={[test.illustrateImage, screenWidth < 800 && {width: 100, height: 100}]}
        />
        </View>
    );
  }
  {/* </LinearGradient> */}


  const ActionRow = () => {
    return (
      <View style={testStyles.horizontalContainer}>
        {[
          { icon: "call-split", label: ["Split", "money"], route: "/action/create/createExpense" },
          { icon: "arrow-collapse", label: ["Add", "Transaction"], route: "/action/create/createTransaction" },
          { icon: "account-multiple-plus", label: ["New","Group"], route: "/action/create/createGroup" },
          { icon: "sticker-plus-outline", label: ["New","Bill"], route: "/action/create/createBill" },
        ].map((item, index) => (

          <View key={index} style={testStyles.actionContainer}>
            
            <TouchableOpacity style={testStyles.actionCircle} onPress={() => router.push(item.route)}>
              <MaterialCommunityIcons name={item.icon} color="black" size={25} />
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              {item.label.map((item1, i) => (
                <Text key={i} style={testStyles.actionText}>{item1}</Text>
              ))}
            </View>
          </View>

        ))}
      </View>
    );
  }

  const formatUserState = (val: number) => {
      return val > 0 ? `You are owed ₹${formatCurrency(Math.abs(val))}` : val === 0 ? `All settled` : `You owe ₹${formatCurrency(Math.abs(val))}`
  }

  const GroupRow = ({groupData}:  {groupData: Omit<Group, "members"> & { userState: number }}) => {
    if(!groupData) return null;

    return (
      <TransactionCard 
        pressFunction = {() => router.push({ pathname: "/view/viewGroup", params: { id: groupData._id} })}
        title = {groupData.group_title}
        subtitle={formatUserState(groupData.userState)}
        subtitleStyle={{color: groupData.userState > 0 ? COLORS.amount.positive : groupData.userState === 0 ? COLORS.amount.neutral : COLORS.amount.negative }}
      />
    );
  }

  const BillRow = ({bill} : {bill: Bill}) => {
    return (
      <TransactionCard
        pressFunction = {() => router.push({ pathname: "/view/viewBill", params: { id:bill._id} })} 
        title = {bill.bill_title}
        imageType = {undefined}
        amount={`₹${bill.amount}`}
        subtitle={`Due date: ${formatDate(bill.due_date_time)}`}
        transactionType={undefined}
      />
    )
  }


  return (
    <ScrollView style={testStyles.screen}>
      <HomeHeader/>

      <View style={testStyles.container}>

        {/* Quick Actions */}
        <ActionRow/>

        {/* Groups */}
        <View>
          <View style={[testStyles.horizontalContainer, {alignItems: "center"}]}>
            <Text style={test.sectionTitle}>Recent Group</Text>
            <Button style={test.viewAll} onPress={()=>router.push("/(tabs)/groups")} rippleColor={COLORS.button.primary.background}>
                <Text style={{color: COLORS.button.wide.background}}>View all</Text>
            </Button>
          </View>

          {isLoadingGroup ? (
            <SkeletonPlaceholder style={{ height: 70, borderRadius: 10 }} />
          ) : (
            <GroupRow groupData={recentGroup}/>
          )}
        </View>

        {/* Bills */}
        <View>
          <View style={[testStyles.horizontalContainer, {alignItems: "center"}]}>
            <Text style={test.sectionTitle}>Upcoming Bills This Month</Text>
            <Button style={test.viewAll} onPress={()=>router.push("/(tabs)/bills")} rippleColor={COLORS.button.primary.background}>
                <Text style={{color: COLORS.button.wide.background}}>View all</Text>
            </Button>
          </View>

          {isLoadingBills ? (
            <>
              {[...Array(2)].map((_, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <SkeletonPlaceholder style={{ height: 70, borderRadius: 10 }} />
                </View>
              ))}
            </>
          ) : (
            <>
              {pendingBills.map((bill: Bill) => (
                <BillRow key={bill._id} bill={bill} />
              ))}
            </>
          )}

        </View>

      </View>

    </ScrollView>
  );
}

const test = StyleSheet.create({

  //header
  headerContainer: {
    marginBottom: 30,
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 10,
    backgroundColor: COLORS.secondary
  },

  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  greeting: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: '#000'
  },

  financeStats: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    gap: 28,
  },

  financeStatLabel: { 
    fontSize: FONTS.small,
    fontWeight: '500',
    color: COLORS.text.primary
  },

  financeStatAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },

  financeStatAmount: {
    fontSize: FONTS.xlarge,
    fontWeight: '600',
    color: COLORS.amount.positive
  },

  illustrateImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: 5,
    opacity: 0.85,
  },

  //recent group
  sectionTitle: { 
    fontSize: FONTS.medium,
    fontWeight: "500"
  },

  viewAll: {
    alignSelf: "flex-end"
  }


});

const styles = StyleSheet.create({
  page:{
    flex:1,
    backgroundColor: "#ffffff"
  },
  container: { 
    justifyContent:"space-between",
    padding: 20
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
image: {
  width: 160,
  height: 160,
  resizeMode: "contain",
  position: "absolute",
  bottom: -5,
  right: 3
},
});