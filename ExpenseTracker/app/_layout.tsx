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
  initialRouteName: 'welcome',
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
    <Provider store={store}>
      <PaperProvider theme={paperLightTheme}>
        <RootLayoutNav />
      </PaperProvider>
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="google" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="forget" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{ headerShown: false }} />
        <Stack.Screen name="reset" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="addSplit" options={{headerShown:false}}/>
        <Stack.Screen name="addSplitPeople" options={{headerShown:false}}/>
        <Stack.Screen name="addTransaction" options={{headerShown:false}}/>
        <Stack.Screen name="createGroup" options={{headerShown:false}}/>
        <Stack.Screen name="createBill" options={{headerShown:false}}/>
        <Stack.Screen name="createWallet" options={{headerShown:false}}/>
        <Stack.Screen name="viewPeople" options={{headerShown:false}}/>
        <Stack.Screen name="createSettlement" options={{headerShown:false}}/>
        <Stack.Screen name="createBudget" options={{headerShown:false}}/>
        <Stack.Screen name="viewBudget" options={{headerShown:false}}/>
        <Stack.Screen name="viewProfile" options={{headerShown:false}}/>
        <Stack.Screen name="viewExpense" options={{headerShown:false}}/>
        <Stack.Screen name="viewTransaction" options={{headerShown:false}}/>
        <Stack.Screen name="viewGroup" options={{headerShown:false}}/>
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
