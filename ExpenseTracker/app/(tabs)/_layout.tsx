import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useTransition,
} from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { Tabs, useRouter, usePathname } from "expo-router";
import {
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TabView, SceneMap } from "react-native-tab-view";
import IndexScreen from "./index";
import GroupsScreen from "./groups";
import ActivityScreen from "./activity";
import BillsScreen from "./bills";
import MoreScreen from "./more";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const routes = [
  { key: "index", title: "Home", icon: "home-outline" },
  { key: "groups", title: "Groups", icon: "account-multiple" },
  { key: "activity", title: "Activity", icon: "progress-clock" },
  { key: "bills", title: "Bills", icon: "sticker-text-outline" },
  { key: "more", title: "More", icon: "dots-horizontal" },
];

const initialLayout = { width: Dimensions.get("window").width };

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
    <View style={{ width: screenWidth / 5, height: 60 }}>
      <Pressable
        onPress={onPress}
        android_ripple={null}
        style={({ pressed }) => [
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          Platform.OS === "ios" && pressed ? { opacity: 1 } : {}, // disables iOS press effect
        ]}
      >
        {children}
      </Pressable>
    </View>
  );
};
export default function SwipeableTabLayout() {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  const [tabRoutes] = useState(routes);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const TAB_WIDTH = initialLayout.width / tabRoutes.length;
  const updateIndex = (newIndex: number) => {
    indexRef.current = newIndex;
    setIndex(newIndex);
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy, moveX } = gestureState;
        const fromEdge = moveX < 120 || moveX > screenWidth - 120;
        const bigEnough = Math.abs(dx) > 15;
        return bigEnough && fromEdge;
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {},
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy, moveX } = gestureState;
        const fromEdge = moveX < 120 || moveX > screenWidth - 120;
        const bigEnough = Math.abs(dx) > 150;

        if (bigEnough && fromEdge) {
          if (dx > 5 && indexRef.current > 0) {
            const newIndex = indexRef.current - 1;
            updateIndex(newIndex);
            router.push(routePathMap[routes[newIndex].key as RouteKey]);
          } else if (dx < -5 && indexRef.current < routes.length - 1) {
            const newIndex = indexRef.current + 1;
            updateIndex(newIndex);
            router.push(routePathMap[routes[newIndex].key as RouteKey]);
          }
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {},
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  const translateX = useRef(new Animated.Value(index * TAB_WIDTH)).current;
  const routePathMap = {
    index: "/",
    groups: "/groups",
    activity: "/activity",
    bills: "/bills",
    more: "/more",
  } as const;

  type RouteKey = keyof typeof routePathMap;
  const handleTabPress = useCallback((i: number, routeKey: RouteKey) => {
    setIndex(i);
    router.push(routePathMap[routeKey]);
  }, []);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "index":
        return <IndexScreen />;
      case "groups":
        return <GroupsScreen />;
      case "activity":
        return <ActivityScreen />;
      case "bills":
        return <BillsScreen />;
      case "more":
        return <MoreScreen />;
      default:
        return null;
    }
  };
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      stiffness: 300,
      damping: 20,
      mass: 0.5,
    }).start();
  }, [index]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const newIndex = tabRoutes.findIndex((route) => {
      const basePath = routePathMap[route.key as RouteKey];
      return pathname === basePath || pathname.startsWith(basePath + "/");
    });

    if (newIndex !== -1 && newIndex !== indexRef.current) {
      updateIndex(newIndex);
    }
  }, [pathname, index]);

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <View style={{ flex: 1, paddingBottom: 60 }}>
        {/* Tab Screens */}
        <TabView
          navigationState={{ index, routes: tabRoutes }}
          renderScene={renderScene}
          onIndexChange={(i) => {
            updateIndex(i);
            router.push(routePathMap[routes[i].key as RouteKey]);
          }}
          initialLayout={initialLayout}
          swipeEnabled={false}
          renderTabBar={() => null} // HIDE default top tab bar
        />
      </View>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.topIndicator,
            {
              width: TAB_WIDTH,
              transform: [{ translateX }],
              backgroundColor: "#264CA7",
            },
          ]}
        />
        {tabRoutes.map((tab, i) => {
          const focused = i === index;
          return (
            <CustomTabButton
              key={tab.key}
              isFocused={focused}
              onPress={() => handleTabPress(i, tab.key as RouteKey)}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={30}
                color={focused ? "#264CA7" : "#999"}
                style={{ textAlign: "center" }}
              />
            </CustomTabButton>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    paddingTop: 25,
    bottom: 0,
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
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
