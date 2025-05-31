import { StyleSheet ,View, Text, Image, FlatList, TouchableOpacity,Dimensions, ActivityIndicator, StatusBar,Pressable,Alert, ScrollView} from 'react-native';
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import TransactionCard from '@/components/readComponents/TransactionCard';
import { useGetUserCurrentExchangeStatusQuery, useGetUserGroupsQuery,useGetUserQuery,useUpdateUserAccessTokenMutation,useGetTodaySpendQuery } from '@/store/userApi';
import { Group } from '@/store/groupApi';
import SkeletonPlaceholder from '@/components/skeleton/SkeletonPlaceholder';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS } from '../utils/constants';
import { testStyles } from '@/styles/test';
import { formatCurrency } from '../utils/helpers';
import { Bill, useGetMonthlyPendingBillsQuery } from '@/store/billApi';
import { formatDate } from '../utils/dateUtils';
import { hasAndroidPermission } from '../utils/permissions';

export default function HomeScreen() {
  const router = useRouter();

  const { authToken, loading } = useAuth();
  const [updateUserAccessToken] = useUpdateUserAccessTokenMutation();

  const {data: dataUser, isLoading: isLoadingUser, error: errorUser, isError: hasErrorUser, refetch: refetchUser} = useGetUserQuery();
  const {data: exchangeData, isLoading, error: errorExchange, isError: hasErrorExchange, refetch: refetchExchange} = useGetUserCurrentExchangeStatusQuery();
  const {data:dataGroup, isLoading:isLoadingGroup, error:errorGroup, isError: hasErrorGroup, refetch: refetchGroup} = useGetUserGroupsQuery();
  const {data: dataPendingBills, isLoading: isLoadingBills, error: errorBill, isError: hasErrorBills, refetch: refetchBill} = useGetMonthlyPendingBillsQuery();
  const {data:todaySpend, isLoading: isLoadingSpend,refetch, error: errorSpend} = useGetTodaySpendQuery();

  const errors = [errorExchange, errorGroup, errorUser, errorBill].filter(Boolean);
  const hasErrors = errors.length > 0;

  const handleRetry = () => {
    if (hasErrorUser) refetchUser();
    if (hasErrorExchange) refetchExchange();
    if (hasErrorGroup) refetchGroup();
    if (hasErrorBills) refetchBill();
  };

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  const getToken = async () => {
    const token = await messaging().getToken();
    updateUserAccessToken({token:token});
  }

  useEffect(() => {
    if (!loading && !authToken) {
      router.replace("/auth/welcome");
    }
  }, [authToken, loading]);

  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Foreground:', remoteMessage);
    });

    return unsubscribe;
  }, []);
  
  useEffect(() => {
    const init = async () => {
      const hasNotificationPermission = await hasAndroidPermission(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (hasNotificationPermission) {
        getToken();
      }
    };
    init();
  }, []);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }, []);


  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const groups: Group[] = dataGroup?.data || [];

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
        <View style={Styles.headerContainer}>
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
                style={[Styles.userAvatar, {backgroundColor: '#F3F4F6'}]}
              />
            ) : (
              <LinearGradient
                colors={["#FFFFFF", "#F3F4F6"]}
                style={Styles.userAvatar}
              />
            )}
            <Text style={Styles.greeting} numberOfLines={1}>
              Hi, {dataUser?.data?.name}
            </Text>
          </TouchableOpacity>

          {/* Financial Info */}
          <View
            style={[Styles.financeStats, screenWidth < 800 && {gap: 20}]}
          >
            {/* You Owed */}
            <View style={{ gap: 2 }}>
              <Text style={Styles.financeStatLabel}>You owed</Text>

              {!isLoading && (
                <View style={Styles.financeStatAmountContainer}>
                  <Text style={[Styles.financeStatAmount, {color: COLORS.amount.positive}, screenWidth < 800 && {fontSize: FONTS.large}]}>₹</Text>
                  <Text style={[Styles.financeStatAmount, {color: COLORS.amount.positive}, screenWidth < 800 && {fontSize: FONTS.large}]}>
                    {formatCurrency(exchangeData?.data?.lendedAmount)}
                  </Text>
                </View>
              )}

            </View>

            {/* You Owe */}
            <View style={{ gap: 2 }}>
              <Text style={Styles.financeStatLabel}>You owe</Text>

              {!isLoading && (
                <View style={Styles.financeStatAmountContainer}>
                  <Text style={[Styles.financeStatAmount, {color: COLORS.amount.negative}, screenWidth < 800 && {fontSize: FONTS.large}]}>₹</Text>
                  <Text style={[Styles.financeStatAmount, {color: COLORS.amount.negative}, screenWidth < 800 && {fontSize: FONTS.large}]}>
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
          style={[Styles.illustrateImage, screenWidth < 800 && {width: 100, height: 100}]}
        />
        </View>
    );
  }
  {/* </LinearGradient> */}


  const ActionRow = () => {
    return (
      <View style={testStyles.horizontalContainer}>
        {[
          { icon: "call-split", label: ["Split", "Money"], route: "/action/create/createExpense" },
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

  //we do have this error componenet but use this
  //only for list screens
  // if (hasErrors) {
  //   return <ErrorState errors={errors} onRetry={handleRetry} />;
  // }

  return (
    <ScrollView style={testStyles.screen}>
      <HomeHeader/>

      <View style={testStyles.container}>

        {/* Quick Actions */}
        <ActionRow/>

        {/* Groups */}
        <View>
          <View style={[testStyles.horizontalContainer, {alignItems: "center"}]}>
            <Text style={Styles.sectionTitle}>Recent Group</Text>
            {/* <Button style={Styles.viewAll} onPress={()=>router.push("/(tabs)/groups")} rippleColor={COLORS.button.primary.background}>
                <Text style={{color: COLORS.button.wide.background}}>View all</Text>
            </Button> */}
          </View>

          {isLoadingGroup ? (
            <SkeletonPlaceholder style={{ height: 70, borderRadius: 10 }} />
          ) : (
            <>
              { recentGroup ? (
                <GroupRow groupData={recentGroup}/>
              ) : (
                <Text style={{ textAlign: "center", marginTop: 20, color: COLORS.text.secondary }}>No Groups</Text>
              )}
            </>
          )}
        </View>

        {/* Bills */}
        <View>
          <View style={[testStyles.horizontalContainer, {alignItems: "center"}]}>
            <Text style={Styles.sectionTitle}>Upcoming Bills This Month</Text>
            {/* <Button style={Styles.viewAll} onPress={()=>router.push("/(tabs)/bills")} rippleColor={COLORS.button.primary.background}>
                <Text style={{color: COLORS.button.wide.background}}>View all</Text>
            </Button> */}
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
            { pendingBills.length > 0 ? (
              pendingBills.map((bill: Bill) => (
                <BillRow key={bill._id} bill={bill} />
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20, color: COLORS.text.secondary }}>No pending bills</Text>
            )}
            </>
          )}

        </View>

      </View>

    </ScrollView>
  );
}

const Styles = StyleSheet.create({

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