
import React from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Tabs, useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TabBarIcon = ({ name, color, focused, route }) => {
  const router = useRouter();
  const animatedValue = new Animated.Value(focused ? 1 : 0);

  // Smooth animation for selection
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  // Interpolate background color for the highlight effect
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "rgba(58, 90, 255, 0.15)"], // Light highlight color
  });

  return (
    <TouchableOpacity
      style={[styles.tabContainer]}
      onPress={() => router.push(route)}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.highlight, { backgroundColor }]} />
      <MaterialCommunityIcons name={name} size={28} color={color} />
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#3A5AFF",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home-outline" color={color} focused={focused} route="/(tabs)" />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="chart-line-variant" color={color} focused={focused} route="/(tabs)/activity" />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="account" color={color} focused={focused} route="/(tabs)/friends" />
          ),
        }}
      />
      <Tabs.Screen
        name="wallets"
        options={{
          title: "Wallets",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="wallet" color={color} focused={focused} route="/(tabs)/wallets" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  highlight: {
    position: "absolute",
    top: 1,
    width: "170%",
    height: "100%",
    borderRadius: 10,
  },
});
