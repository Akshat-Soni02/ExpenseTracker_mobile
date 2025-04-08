import { ScrollView ,FlatList, ActivityIndicator} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { globalStyles } from "@/styles/globalStyles";
import TransactionCard from "@/components/TransactionCard";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';
import * as React from 'react';
import moment from "moment";
import {useGetUserGroupsQuery} from '@/store/userApi'; 

export default function GroupsScreen() {
  const router = useRouter();
  const [value, setValue] = React.useState('');
  const {data: dataGroup, isLoading: isLoadingGroup, error: errorGroup} = useGetUserGroupsQuery({});
  
  if (isLoadingGroup) {
    return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  }
  
  if (errorGroup) {
    return <Text>Error: {errorGroup?.message || JSON.stringify(errorGroup)}</Text>;
  }

  const groups = dataGroup.data;
  const numberOfGroups = groups.length; 

  return (
    <View style={globalStyles.screen}>
        <ScrollView style={globalStyles.viewContainer}>
          <View style = {globalStyles.viewHeader}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style = {globalStyles.backButton}/>     
            <Text style={globalStyles.headerText}>Groups</Text>
          </View>

          {numberOfGroups>0?(<FlatList
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

          />):
          <Text style={globalStyles.noText}>No groups found</Text>
          }
          
        </ScrollView>
        <FAB
            label="Add Group"
            style={globalStyles.fab}
            onPress={() => router.push("/action/create/createGroup")}
        />
    </View>
  );
}
