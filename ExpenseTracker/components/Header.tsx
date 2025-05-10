import { globalStyles } from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

interface HeaderProps {
    headerText?: string;
    headerIcon?: any;
}

const Header: React.FC<HeaderProps> = ({headerIcon, headerText}) => {
    return (
        <View style = {globalStyles.viewHeader}>
            <AntDesign name="arrowleft" size={25} color="black" onPress={() => router.back()} style = {{backgroundColor: "white"}}/>
            {headerText && <Text style={globalStyles.headerText}>{headerText}</Text>}
            {headerIcon && headerIcon}
        </View>
    );
};

export default Header;

