import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import { useLazyGetUserByIdQuery } from "@/store/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyGetWalletQuery } from "@/store/walletApi";
import { useGetSettlementQuery, useDeleteSettlementMutation } from "@/store/settlementApi";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";

// router.push({ pathname: "/viewTransaction", params: {id: "67cf2e67b3452d6bb43d2a23"} })

const SettlementDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetSettlementQuery(id);
  const [deleteSettlement, {isLoading: deleteLoading, error: deleteError}] = useDeleteSettlementMutation();
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [getUserById, { data: creatorData }] = useLazyGetUserByIdQuery();
  const [receiver, setReceiver] = useState({});
  const [payer, setPayer] = useState({});
//   const [userState, setUserState] = useState(null);
  const [getWallet, { data: walletData }] = useLazyGetWalletQuery();
  
  const [menuVisible, setMenuVisible] = useState(false);

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
            setPayer(prevUser => ({
                ...prevUser,
                name: "You"
            }));
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
            setReceiver(prevUser => ({
                ...prevUser,
                name: "You"
            }));
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

  const handleSettlementDelete = async () => {
    try {
      const response = await deleteSettlement(id);
      console.log("settlement deleting response",response);
      if(!response || deleteError) {
        console.log(error);
        // setMenuVisible(false);
      }
      router.replace("/(tabs)/activity")
    } catch (error) {
      
    }
  }

  if (isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  if (error) return <Text>Error loading settlement details</Text>;
  if (!data?.data || !loggedInUserId) return <Text>No settlement found</Text>;

//   const isPayer = settlement.payer_id === loggedInUserId;
//   const isReceiver = settlement.receiver_id === loggedInUserId;


  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.back()} style = {styles.backButton}/>
        {/* Menu Component */}
        <View>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                <Entypo name="dots-three-vertical" size={20} color="black" />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => {setMenuVisible(false);router.push({ pathname: "/editSettlement", params: {id} })}} title="Edit" />
            <Divider />
            <Menu.Item onPress={() => Alert.alert(
                                              "Delete settlement", 
                                              `Are you sure you want to delete ${settlement.settlement_description}`, 
                                              [
                                                { text: "Cancel", style: "cancel" },
                                                { text: "Yes", onPress: () => handleSettlementDelete()}
                                              ]
                                            )} title="Delete" />
          </Menu>
        </View>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.title}>{settlement.settlement_description}</Text>
        <Text style={[styles.amount]}>₹{settlement.amount}</Text>
        {(settlement.payer_wallet_id || settlement.receiver_wallet_id) && (
            <Text style={styles.accountName}>Wallet: {walletData?.data?.wallet_title || "Unknown"}</Text>
        )}
        {/* {isLender && expense.wallet_id && (
          <Text style={styles.accountName}>Wallet: {walletData?.data?.wallet_title || "Unknown"}</Text>
        )} */}
        <Text style={styles.date}>{moment(settlement.createdAt).format("DD MMM YYYY, hh:mm A")}</Text>
      </View>

      <View style={styles.splitContainer}>
        <View style = {styles.usersContainer}>
            {payer?.profile_photo ? (<Image source={{ uri: payer.profile_photo.url }} style={styles.avatar} />) : (<LinearGradient colors={["#FFFFFF", "#F3F4F6"]} style={styles.avatar} />)}
            <Text style = {styles.accountName} >{payer.name}</Text>
        </View>
        <Icon name="arrow-forward" size={40} color="black" />
        <View style = {styles.usersContainer}>
            {receiver?.profile_photo ? (<Image source={{ uri: receiver.profile_photo.url }} style={styles.avatar} />) : (<LinearGradient colors={["#FFFFFF", "#F3F4F6"]} style={styles.avatar} />)}
            <Text style = {styles.userName}>{receiver.name}</Text>
        </View>
      </View>

      {settlement.media && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: settlement.media.url }} style={styles.previewImage} />
      </View>
      )}
    </View>
  );
};

export default SettlementDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  usersContainer:{
    justifyContent: "space-between",
    alignItems: "center",
    gap: 3
  },
  userName: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  menuButton: {
    padding: 10,
  },
  detailContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  amount: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
  },
  accountName: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  date: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
  notesContainer: {
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  notesTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#374151",
  },
  notesText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  splitContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  },
  paidBy: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#374151",
    marginBottom: 5,
  },
  oweText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  boldText: {
    fontFamily: "Poppins_700Bold",
  },
});