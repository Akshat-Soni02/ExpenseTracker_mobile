import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import { View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoogleLoginMutation } from '@/store/userApi';
import { useAuth } from '@/context/AuthProvider';
import { router } from 'expo-router';

// WebBrowser.maybeCompleteAuthSession();

export const handleGoogleSignOut = async () => {
  try {
    await GoogleSignin.signOut();
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

const GoogleButton = () => {
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const {  login } = useAuth();

    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '41930990796-v0crd8n8lnpnolcjuqgd9do6mm4cfe5b.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      });

    return (
        // <Button title="Sign in with Google"  />
        <View>
        <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        style={{ width: 300, height: 58, borderRadius: 5 }}
        onPress={async () => {
            try {
                const currentUser = await GoogleSignin.getCurrentUser();
                console.log("Current User:", currentUser);
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();
              const res = await googleLogin({idToken: userInfo.data?.idToken});
              await login(res.data.token);
              await AsyncStorage.setItem("user", JSON.stringify(res.data.userData));
              router.push("/(tabs)");
              console.log(JSON.stringify(userInfo, null, 2));
            } catch (error: any) {
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log("User cancelled the login");
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                console.log("User sign-in in progress already");
              } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log("play services are not available or outdated");
              } else {
                // some other error happened
                console.log(error);
                console.log("server error while login in through google");
              }
            }
          }}

        />
        {/* <Button title="Sign Out" onPress={handleGoogleSignOut} /> */}
        </View>
    );
};

export default GoogleButton;