// import React from 'react';
// import { Pressable, View ,StyleSheet,TouchableOpacity} from 'react-native';
// import { Link, Tabs,useRouter } from 'expo-router';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Colors from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
// import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// // function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof MaterialCommunityIcons>['name']; color: string }) {
// //   return <MaterialCommunityIcons name={name} size={28} color={color} />;
// // }
// function TabBarIcon({ name, color, focused ,route}: { name: React.ComponentProps<typeof MaterialCommunityIcons>['name']; color: string; focused: boolean ;route:string}) {
//   const router = useRouter();
//   return (
//     // <View
//     //   style={{
//     //     backgroundColor: focused ? '#007AFF' : 'transparent',
//     //     borderRadius:10,
//     //     width:40,
//     //     alignItems:"center",
        
//     //   }}>
//     //   <MaterialCommunityIcons name={name} size={30} color={focused ? 'white' : color} />
//     // </View>
//     <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center'}} onPress={() => router.push(route)}>
//       <MaterialCommunityIcons name={name} size={30} color={focused ? '#3A5AFF' : '#000'} />
//     </TouchableOpacity>
//   );
// }

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const themeColor = Colors[colorScheme ?? 'light'];
//   const router = useRouter();

//   return (
//     <Tabs
//       screenOptions={{
//         // tabBarActiveTintColor: themeColor.tint,
//         // tabBarInactiveTintColor: themeColor.tabIconDefault,
//         headerShown:false,
//         tabBarStyle: {
//           height: 60, // ⬆ Increased height
//           backgroundColor: '#fff', // Light gradient-like color

//           borderTopWidth: 0, // Remove top border
//           shadowOpacity: 0.2, // Soft shadow effect
//           elevation: 5,
//         },
//         tabBarLabelStyle: {
//           fontSize: 13, // ⬆ Increased text size
//           fontWeight: "light", // Makes text bold
//         },
//         tabBarActiveTintColor: '#3A5AFF', // Blue for active tab
//         tabBarInactiveTintColor: '#000', // Gray for inactive tabs
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color,focused }) => <TabBarIcon name="home-outline" color={color} focused={focused} route="/(tabs)"/>,

//         }}
//       />
//       <Tabs.Screen
//         name="activity"
//         options={{
//           title: 'Activity',
//           tabBarIcon: ({ color,focused }) => <TabBarIcon name="chart-line-variant" color={color} focused={focused} route="/(tabs)/activity"/>,
//         }}
        
//       />
//       <Tabs.Screen
//         name="people"
//         options={{
//           title: 'Friends',
//           tabBarIcon: ({ color ,focused}) => <TabBarIcon name="account" color={color} focused={focused} route="/(tabs)/people"/>,
//         }}
//       />
//       <Tabs.Screen
//         name="wallets"
//         options={{
//           title: 'Wallets',
//           tabBarIcon: ({ color,focused }) => <TabBarIcon name="wallet" color={color} focused={focused} route="/(tabs)/wallets"/>,
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   defaultTab: {
//     height: 90,
//     backgroundColor: '#FFFFFF', // Default white background
//   },
//   activeTab: {
//     height: 90,
//     backgroundColor: 'rgba(58, 90, 255, 0.1)', // Light blue when active
//   },
// });


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
        name="people"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="account" color={color} focused={focused} route="/(tabs)/people" />
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
