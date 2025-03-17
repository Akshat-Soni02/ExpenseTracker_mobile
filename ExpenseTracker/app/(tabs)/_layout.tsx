// import React from 'react';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Link, Tabs } from 'expo-router';
// import { Pressable } from 'react-native';

// import Colors from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
// import { useClientOnlyValue } from '@/components/useClientOnlyValue';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// // You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         // Disable the static render of the header on web
//         // to prevent a hydration error in React Navigation v6.
//         headerShown: useClientOnlyValue(false, true),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           headerShown: false,
//           tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-outline" color="black" size={28} />,
//           headerRight: () => (
//             <Link href="/modal" asChild>
//               <Pressable>
//                 {({ pressed }) => (
//                   <FontAwesome
//                     name="info-circle"
//                     size={25}
//                     color={Colors[colorScheme ?? 'light'].text}
//                     style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
//                   />
//                 )}
//               </Pressable>
//             </Link>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="activity"
//         options={{
//           title: 'Activity',
//           tabBarIcon: ({ color }) => <MaterialCommunityIcons name="history" color="black" size={28} />,
//           headerShown: false,
//         }}
//       />
//       <Tabs.Screen
//         name="people"
//         options={{
//           title: 'People',
//           tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color="black" size={28} />,
//           headerShown: false,
//         }}
//       />
//       <Tabs.Screen
//         name="insights"
//         options={{
//           title: 'Insights',
//           tabBarIcon: ({ color }) => <MaterialCommunityIcons name="google-analytics" color="black" size={28} />,
//           headerShown: false,
//         }}
//       />
//     </Tabs>
//   );
// }



import React from 'react';
import { Pressable, View ,StyleSheet,TouchableOpacity} from 'react-native';
import { Link, Tabs,useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof MaterialCommunityIcons>['name']; color: string }) {
//   return <MaterialCommunityIcons name={name} size={28} color={color} />;
// }
function TabBarIcon({ name, color, focused ,route}: { name: React.ComponentProps<typeof MaterialCommunityIcons>['name']; color: string; focused: boolean ;route:string}) {
  const router = useRouter();
  return (
    // <View
    //   style={{
    //     backgroundColor: focused ? '#007AFF' : 'transparent',
    //     borderRadius:10,
    //     width:40,
    //     alignItems:"center",
        
    //   }}>
    //   <MaterialCommunityIcons name={name} size={30} color={focused ? 'white' : color} />
    // </View>
    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center'}} onPress={() => router.push(route)}>
      <MaterialCommunityIcons name={name} size={30} color={focused ? '#3A5AFF' : '#000'} />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: themeColor.tint,
        // tabBarInactiveTintColor: themeColor.tabIconDefault,
        headerShown:false,
        tabBarStyle: {
          height: 60, // ⬆ Increased height
          backgroundColor: '#fff', // Light gradient-like color

          borderTopWidth: 0, // Remove top border
          shadowOpacity: 0.2, // Soft shadow effect
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 13, // ⬆ Increased text size
          fontWeight: "light", // Makes text bold
        },
        tabBarActiveTintColor: '#3A5AFF', // Blue for active tab
        tabBarInactiveTintColor: '#000', // Gray for inactive tabs
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color,focused }) => <TabBarIcon name="home-outline" color={color} focused={focused} route="/(tabs)"/>,

        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color,focused }) => <TabBarIcon name="history" color={color} focused={focused} route="/(tabs)/activity"/>,
        }}
        
      />
      <Tabs.Screen
        name="people"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color ,focused}) => <TabBarIcon name="account" color={color} focused={focused} route="/(tabs)/people"/>,
        }}
      />
      <Tabs.Screen
        name="wallets"
        options={{
          title: 'Wallets',
          tabBarIcon: ({ color,focused }) => <TabBarIcon name="wallet" color={color} focused={focused} route="/(tabs)/wallets"/>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  defaultTab: {
    height: 90,
    backgroundColor: '#FFFFFF', // Default white background
  },
  activeTab: {
    height: 90,
    backgroundColor: 'rgba(58, 90, 255, 0.1)', // Light blue when active
  },
});
