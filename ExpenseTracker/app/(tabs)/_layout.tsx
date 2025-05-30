import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CustomTabButton } from "@/components/button/CustomTabButton";

interface TabBar {
  name: string;
  color: string;
  focused: boolean;
  route: string;
}

const TabBarIcon: React.FC<TabBar> = ({ name, color, focused, route }) => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Pressable
      onPress={() => router.push(route)}
      android_ripple={{ color: "transparent" }} // Removes Android grey ripple
      style={({ pressed }) => [
        styles.tabContainer,
        Platform.OS === "ios" && pressed ? { opacity: 1 } : {}, // Removes iOS highlight
      ]}
    >
      {focused && <View style={styles.topIndicator} />}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialCommunityIcons name={name} size={26} color={color} />
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff",
          borderTopColor: "#ddd",
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: "#1D3557",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={26} />
          ),
          tabBarButton: (props) => (
            <CustomTabButton {...props} isFocused={props.accessibilityState?.selected} />
          ),
        }}
      />


      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-multiple" color={color} size={26} />
          ),
          tabBarButton: (props) => (
            <CustomTabButton {...props} isFocused={props.accessibilityState?.selected} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="progress-clock" color={color} size={26} />
          ),
          tabBarButton: (props) => (
            <CustomTabButton {...props} isFocused={props.accessibilityState?.selected} />
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: "Bills",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="sticker-text-outline" color={color} size={26} />
          ),
          tabBarButton: (props) => (
            <CustomTabButton {...props} isFocused={props.accessibilityState?.selected} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="dots-horizontal" color={color} size={26} />
          ),
          tabBarButton: (props) => (
            <CustomTabButton {...props} isFocused={props.accessibilityState?.selected} />
          ),
        }}
      />
      <Tabs.Screen name="detectedTransactions" options={{ href: null }} />
      <Tabs.Screen name="budgets" options={{ href: null }} />
      <Tabs.Screen name="wallets" options={{ href: null }} />
      <Tabs.Screen name="friends" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  tabContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  topIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    width: "100%",
    backgroundColor: "#C8E6FF", // bluish theme
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});
