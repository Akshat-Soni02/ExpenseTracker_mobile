import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import store from '@/store/store';
import { useColorScheme } from '@/components/useColorScheme';
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { AuthProvider } from '@/context/AuthProvider';
import { StatusBar } from 'expo-status-bar';
import * as Linking from "expo-linking";

const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6200ee",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    text: "#000000",
  },
};

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <PaperProvider theme={paperLightTheme}>
          <RootLayoutNav />
        </PaperProvider>
      </Provider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const linking = {
    prefixes: ["https://expenseEase.com", "expenseEase://"],
    config: {
      screens: {
        invite: "invite/:referralCode",
        addFriends: "addFriends",
        viewProfile: "profile/:userId",
      },
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forget" options={{ headerShown: false }} />
        <Stack.Screen name="auth/otp" options={{ headerShown: false }} />
        <Stack.Screen name="auth/reset" options={{ headerShown: false }} />
        <Stack.Screen name="action/create/createExpense" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/createTransaction" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/addFriends" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/addPeopleManual" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/createGroup" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/createBill" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/createWallet" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/addPeopleEmail" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/createSettlement" options={{headerShown:false}}/>
        <Stack.Screen name="action/create/createBudget" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewPeople" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewBudget" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewPredictedBudget" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewProfile" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewExpense" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewTransaction" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewGroup" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewWallet" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewBill" options={{headerShown:false}}/>
        <Stack.Screen name="view/viewSettlement" options={{headerShown:false}}/>
        <Stack.Screen name="action/edit/editSettlement" options={{headerShown:false}}/>
        <Stack.Screen name="action/edit/editExpense" options={{headerShown:false}}/>
        <Stack.Screen name="action/edit/editBill" options={{headerShown:false}}/>
        <Stack.Screen name="action/edit/editTransaction" options={{headerShown:false}}/>
        <Stack.Screen name="action/edit/editWallet" options={{headerShown:false}}/>
        <Stack.Screen name="action/edit/editBudget" options={{headerShown:false}}/>
        <Stack.Screen name="action/edit/editGroup" options={{headerShown:false}}/>
        <Stack.Screen name="action/edit/editProfile" options={{headerShown:false}}/>
        <Stack.Screen name="misc/groupSettlements" options={{headerShown:false}}/>
        <Stack.Screen name="misc/privacyPolicy" options={{headerShown:false}}/>
        <Stack.Screen name="misc/contactUs" options={{headerShown:false}}/>
      </Stack>
    </ThemeProvider>
  );
}
