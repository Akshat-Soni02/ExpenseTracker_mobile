import { globalStyles } from "@/styles/globalStyles";
import { testStyles } from "@/styles/test";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

interface HeaderProps {
    headerText?: string;
    headerIcon?: any;
    hideBackButton?: boolean;
    containerStyle?: any;
}

const Header: React.FC<HeaderProps> = ({headerIcon, headerText, hideBackButton, containerStyle}) => {
    return (
        <View style = {[hideBackButton ? testStyles.tabScreenHeader : testStyles.header, containerStyle]}>
            {!hideBackButton && <AntDesign name="arrowleft" size={25} color="black" onPress={() => router.back()} style = {{backgroundColor: "white"}}/>}
            {headerText && <Text style={testStyles.headerText}>{headerText}</Text>}
            {headerIcon && headerIcon}
        </View>
    );
};

export default Header;

