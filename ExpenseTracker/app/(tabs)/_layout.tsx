import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { Tabs, useRouter, usePathname } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TAB_ROUTES = [
  "index",
  "groups",
  "activity",
  "bills",
  "more",
];

const TAB_ICONS = [
  "home-outline",
  "account-multiple",
  "progress-clock",
  "sticker-text-outline",
  "dots-horizontal",
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_COUNT = TAB_ROUTES.length;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

interface CustomTabButtonProps {
  isFocused?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

const CustomTabButton: React.FC<CustomTabButtonProps> = ({
  isFocused,
  onPress,
  children,
}) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={null} // disables ripple
      style={({ pressed }) => [
        styles.tabContainer,
        Platform.OS === "ios" && pressed ? { opacity: 1 } : {}, // disables iOS press effect
      ]}
    >
      {children}
    </Pressable>
  );
};

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = TAB_ROUTES.findIndex(route => pathname.includes(route));
  const [selectedIndex, setSelectedIndex] = useState(currentIndex >= 0 ? currentIndex : 0);

  const translateX = useRef(new Animated.Value(selectedIndex * TAB_WIDTH)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: selectedIndex * TAB_WIDTH,
      useNativeDriver: true,
      stiffness: 200,
      damping: 20,
      mass: 1,
    }).start();
  }, [selectedIndex]);

  const onPressTab = (index: number, route: string) => {
    setSelectedIndex(index);
    router.push(route === "index" ? "/" : `/${route}`);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            backgroundColor: "#fff",
            borderTopColor: "#ddd",
            borderTopWidth: 0.5,
          },
          tabBarShowLabel: false,
        }}
      >
        {TAB_ROUTES.map((route) => (
          <Tabs.Screen
            key={route}
            name={route === "index" ? "index" : route}
            options={{
              headerShown: false,
              tabBarStyle: { display: 'none' },
            }}
          />
        ))}
      </Tabs>

      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        {/* Animated top indicator line */}
        <Animated.View
          style={[
            styles.topIndicator,
            {
              width: TAB_WIDTH,
              transform: [{ translateX }],
              backgroundColor: "#264CA7", // Darker blue you liked
            },
          ]}
        />
        {/* Render each tab button */}
        {TAB_ROUTES.map((route, index) => {
          const focused = index === selectedIndex;
          return (
            <CustomTabButton
              key={route}
              isFocused={focused}
              onPress={() => onPressTab(index, route)}
            >
              <MaterialCommunityIcons
                name={TAB_ICONS[index]}
                size={26}
                color={focused ? "#264CA7" : "#999"}
              />
            </CustomTabButton>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    position: "relative",
  },
  tabContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topIndicator: {
    position: "absolute",
    top: 0,
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});