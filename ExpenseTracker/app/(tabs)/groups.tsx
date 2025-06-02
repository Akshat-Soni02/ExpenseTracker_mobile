import { ScrollView ,FlatList, ActivityIndicator, TouchableOpacity, Text, Button} from "react-native";
import { View } from "@/components/Themed";
import { useRouter } from "expo-router";

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserGroupsQuery} from '@/store/userApi';
import { Group } from "@/store/groupApi";
import Header from "@/components/Header";
import { formatCurrency } from "../utils/helpers";
import { COLORS, FONTS } from "../utils/constants";
import { testStyles } from "@/styles/test";
import EmptyState from "@/components/EmptyState";
import AppFAB from "@/components/AppFAB";
import ErrorState from "@/components/ErrorState";

export default function GroupsScreen() {
  const router = useRouter();
  const {data: dataGroup, isLoading: isLoadingGroup, error: errorGroup, isError: hasErrorGroup, refetch: refetchGroups} = useGetUserGroupsQuery();

  if (isLoadingGroup) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
    
  const errors = [ errorGroup ];
  const handleRetry = () => {
    if (hasErrorGroup) refetchGroups();
  };

  const groups: Group[] = dataGroup?.data || [];
  const numberOfGroups: number = groups.length;

  

  const formatUserState = (val: number) => {
      return val > 0 ? `You are owed ₹${formatCurrency(Math.abs(val))}` : val === 0 ? `All settled` : `You owe ₹${formatCurrency(Math.abs(val))}`
  }

  const GroupRow = ({ groupData }: { groupData: Omit<Group, "members"> & { userState: number }}) => {
    return (
      <TransactionCard 
        pressFunction = {() => router.push({ pathname: "/view/viewGroup", params: { id: groupData._id} })}
        title = {groupData.group_title}
        subtitle={formatUserState(groupData.userState)}
        subtitleStyle={{fontSize: FONTS.small, color: groupData.userState > 0 ? COLORS.amount.positive : groupData.userState === 0 ? COLORS.amount.neutral : COLORS.amount.negative }}
      />
    );
  }

  if (hasErrorGroup) {
    return <ErrorState errors={errors} onRetry={handleRetry} />;
  }
  
  return (
    <View style={[testStyles.screen, {position: 'relative'}]}>

        <ScrollView style={[testStyles.container]}>

          <Header headerText="Groups" hideBackButton/>
          
          { numberOfGroups>0 ? 

          (
            <FlatList
            data={groups}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <GroupRow groupData = {item}/>
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 5, backgroundColor: 'white'}} />
            )}
            contentContainerStyle={{ paddingBottom: 5 }}

          />) : ( <EmptyState
                  title="No groups yet"
                  subtitle="Groups you create or join will appear here."
                  iconName="account-group-outline"
                /> )}
    
        </ScrollView>
        {/* <View style={{ padding: 20 }}> */}
      {/* <Button
        title="Success Toast"
        onPress={() =>
          showToast({
            title: "Split created successfully",
            // message: "Your payment has been successfully received.",
            type: "success",
          })
        }
      />
      <Button
        title="Error Toast"
        onPress={() =>
          showToast({
            title: "Something went wrong",
            // message: "Issue processing your subscription payment.",
            type: "error",
          })
        }
      />
      <Button
        title="Warning Toast"
        onPress={() =>
          showToast({
            title: "Time to Pay Up!",
            message: "Adding admins may cost more.",
            type: "warning",
          })
        }
      />
      <Button
        title="Info Toast"
        onPress={() =>
          showToast({
            title: "Update Available",
            message: "New features have been added.",
            type: "info",
          })
        }
      />
    </View> */}

      <AppFAB
        icon="plus"
        onPress={() => router.push("/action/create/createGroup")}
      />
    </View>
  );
}
