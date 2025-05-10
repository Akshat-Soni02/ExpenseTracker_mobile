import { StyleSheet,ScrollView ,FlatList, ActivityIndicator} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import {  FontAwesome } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';
import * as React from 'react';

import moment from "moment";
import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserGroupsQuery} from '@/store/userApi';
import { Group } from "@/store/groupApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";

export default function GroupsScreen() {
  const router = useRouter();

const {data: dataGroup, isLoading: isLoadingGroup, error: errorGroup} = useGetUserGroupsQuery();

  if (isLoadingGroup) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
    
  if (errorGroup) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorGroup) {
      errorMessage = `Server Error: ${JSON.stringify(errorGroup.data)}`;
    } else if ("message" in errorGroup) {
      errorMessage = `Client Error: ${errorGroup.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  const groups: Group[] = dataGroup?.data || [];
  const numberOfGroups: number = groups.length; 
  
  return (
    <View style={globalStyles.screen}>

        <ScrollView style={globalStyles.viewContainer}>

          <Header headerText="Groups"/>
          
          {numberOfGroups>0 ? (
            <FlatList
            data={groups}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TransactionCard 
              pressFunction = {() => router.push({ pathname: "/view/viewGroup", params: { id:item._id} })}
              title = {item.group_title}
              imageType = {undefined}
              amount={`₹${item.initial_budget}`}
              subtitle={item?.settle_up_date && `Settle Up: ${moment(item?.settle_up_date).format("DD MMM, YYYY")}`}
              transactionType={undefined}
              optionText={"Inital budget"}
              />
            )}
            ItemSeparatorComponent={() => (
              <View style={{  height: 5, backgroundColor: 'white'}} />
            )}
            contentContainerStyle={{ paddingBottom: 5 }}
          />) : <Text style={globalStyles.noText}>No Groups</Text>}
          
        </ScrollView>

        <FAB
        label="Add Group"
        style={globalStyles.fab}
        onPress={() => router.push("/action/create/createGroup")}
        />
        
    </View>
  );
}
