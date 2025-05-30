import { StyleSheet,ScrollView ,FlatList, ActivityIndicator} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';
import * as React from 'react';

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserWalletsQuery} from '@/store/userApi';
import { globalStyles } from "@/styles/globalStyles";
import { Wallet } from "@/store/walletApi";
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import Header from "@/components/Header";
import { testStyles } from "@/styles/test";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FONTS } from "../utils/constants";


export default function MoreScreen() {
  const router = useRouter();

  const FeatureHolder = ({icon, featureText}) => {
    return (
        <View style={{alignItems: "center"}}>
            <MaterialCommunityIcons name={icon} size={28} color="#000" />
            <Text>{featureText}</Text>
        </View>
    );
  }

  return (
    <View style={testStyles.screen}>
        <View style={[testStyles.container]}>
            <Text style={{fontSize: FONTS.large, marginTop: 50, alignSelf: "center"}}>More Options</Text>
            <View style={{flexDirection: "row", justifyContent: "space-around", marginTop: 250}}>
                <FeatureHolder icon={"account"} featureText={"Friends"}/>
                <FeatureHolder icon={"wallet-outline"} featureText={"Wallets"}/>
                <FeatureHolder icon={"download"} featureText={"Export Data"}/>
            </View>
        </View>
    </View>
);
}