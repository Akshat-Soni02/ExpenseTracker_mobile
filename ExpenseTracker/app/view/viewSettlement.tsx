import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useLazyGetUserByIdQuery, User } from "@/store/userApi";
import { useLazyGetWalletQuery } from "@/store/walletApi";
import { useGetSettlementQuery, useDeleteSettlementMutation } from "@/store/settlementApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";


const SettlementDetailsScreen = () => {
  const { id } = useLocalSearchParams() as {id: string};

  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [payer, setPayer] = useState<User | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data, isLoading, error, refetch } = useGetSettlementQuery(id);
  const [deleteSettlement, {isLoading: deleteLoading, error: deleteError}] = useDeleteSettlementMutation();
  const [getUserById, { data: creatorData }] = useLazyGetUserByIdQuery();
  const [getWallet, { data: walletData }] = useLazyGetWalletQuery();
  let isPayer = false;
  
  const settlement = data?.data;

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setLoggedInUserId(user._id);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (settlement?.payer_id && loggedInUserId) {
      (async () => {
        const res = await getUserById(settlement?.payer_id).unwrap();
        setPayer(res.data);
        if (settlement?.payer_id === loggedInUserId) {
          isPayer = true;
          setPayer(prevUser => {
            if (!prevUser) return null;
            return {
              ...prevUser,
              name: "You",
            };
          });
        }
      })();
    }
  }, [data, getUserById, loggedInUserId]);

  useEffect(() => {
    if (settlement?.receiver_id && loggedInUserId) {
      (async () => {
        const res = await getUserById(settlement?.receiver_id).unwrap();
        setReceiver(res.data);
        if (settlement?.receiver_id === loggedInUserId) {
          setReceiver(prevUser => {
            if (!prevUser) return null;
            return {
              ...prevUser,
              name: "You",
            };
          });
        }
      })();
    }
  }, [data, getUserById, loggedInUserId]);

  useEffect(() => {
    if (settlement?.payer_wallet_id) {
        getWallet(settlement.payer_wallet_id);
    }
    if (settlement?.receiver_wallet_id) {
        getWallet(settlement.receiver_wallet_id);
    }
  }, [settlement?.payer_wallet_id, settlement?.receiver_wallet_id]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);

  const handleSettlementDelete = async () => {
    try {
      const response = await deleteSettlement(id);
      router.replace("/(tabs)/activity")
    } catch (error) {
      console.log(error);
      const err = error as { data?: { message?: string } };
      if (err?.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  if (isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (error) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in error) {
      errorMessage = `Server Error: ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      errorMessage = `Client Error: ${error.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  if (!data?.data || !loggedInUserId) return <Text>No settlement found</Text>;

  return (
    <View style={globalStyles.viewContainer}>

      <Header headerIcon={<Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)} style={globalStyles.menuButton}>
                <Entypo name="dots-three-vertical" size={20} color="black" />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => {setMenuVisible(false);router.push({ pathname: "/action/edit/editSettlement", params: {id} })}} title="Edit" />
            <Divider />
            <Menu.Item onPress={() => Alert.alert(
              "Delete settlement", 
              `Are you sure you want to delete ${settlement?.settlement_description}`, 
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => handleSettlementDelete()}
              ]
            )} title="Delete" />
          </Menu>}/>

      <View style={globalStyles.viewActivityDetailContainer}>

        <Text style={globalStyles.viewActivityTitle}>{settlement?.settlement_description}</Text>
        <Text style={[globalStyles.viewActivityAmount, {fontSize: 30}]}>₹{settlement?.amount?.toFixed(2)}</Text>

      </View>

      <View style = {styles.minDetails}>
        <View style = {styles.minDetailsDownView}><MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#0A6FE3" />   <Text style = {styles.minDetailsDownText}>{moment(settlement?.createdAt).format("DD MMM YYYY, hh:mm A")}</Text></View>
          {(settlement?.payer_wallet_id || settlement?.receiver_wallet_id) && (
            <View style = {styles.minDetailsDownView}><MaterialCommunityIcons name="wallet-outline" size={24} color="#0A6FE3" />   <Text style = {styles.minDetailsDownText}>{settlement?.payer_wallet_id ? "Paid via " : "Received in "}{walletData?.data?.wallet_title || "Unknown"}</Text></View>
          )}
      </View>

      <View style={styles.splitContainer}>

        <View style = {styles.usersContainer}>
            <Text style = {styles.userName} >From</Text>
            {payer?.profile_photo ? (<Image source={{ uri: payer.profile_photo.url }} style={styles.avatar} />) : (<LinearGradient colors={["#FFFFFF", "#F3F4F6"]} style={styles.avatar} />)}
            <Text style = {styles.userName} >{payer?.name}</Text>
        </View>

        <Icon name="arrow-forward" size={40} color="black" />

        <View style = {styles.usersContainer}>
            <Text style = {styles.userName}>To</Text>
            {receiver?.profile_photo ? (<Image source={{ uri: receiver.profile_photo.url }} style={styles.avatar} />) : (<LinearGradient colors={["#FFFFFF", "#F3F4F6"]} style={styles.avatar} />)}
            <Text style = {styles.userName}>{receiver?.name}</Text>
        </View>
      </View>

      {/* {settlement?.media && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: settlement?.media.url }} style={styles.previewImage} />
      </View>
      )} */}
    </View>
  );
};

export default SettlementDetailsScreen;

const styles = StyleSheet.create({

  usersContainer:{
    justifyContent: "space-between",
    alignItems: "center",
    gap: 3
  },
  userName: {
    fontSize: 18,
    // fontFamily: "Poppins_400Regular",
    // color: "#6B7280",
  },
  avatar: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
  },
  mediaContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  splitContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    // borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#D1D5DB",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    alignSelf: "center"
  },
  minDetails: {
    width: 350,
    padding: 10,
    backgroundColor: "#F5FAFE",
    borderRadius: 7,
    alignSelf: "center",
    marginBottom: 10
  },
  minDetailsDownView: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center"
  },
  minDetailsDownText: {
    fontSize: 15,
    color: "#102547",
    textAlignVertical: "center"
  },
});