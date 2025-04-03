import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import { Alert, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthProvider';
import { router } from 'expo-router';

import { useAutoaddFriendsMutation, useGoogleLoginMutation } from '@/store/userApi';


export const handleGoogleSignOut = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error("Logout Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    Alert.alert("Error logging out", errorMessage);
  }
};

const GoogleButton = () => {
  const [googleLogin, { isLoading: isLoadingGoogle, error: errorGoogle }] = useGoogleLoginMutation();
  const [autoAdd, {isLoading: isLoadingAutoFriends, error: errorAutoAddFriends}] = useAutoaddFriendsMutation();
  const { login } = useAuth();

    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '41930990796-v0crd8n8lnpnolcjuqgd9do6mm4cfe5b.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      });

    return (
        <View>
        <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        style={{ width: 300, height: 58, borderRadius: 5 }}
        disabled={isLoadingGoogle}
        onPress={async () => {

            try {
                // const currentUser = GoogleSignin.getCurrentUser();
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();
              if (!userInfo || !userInfo?.data?.idToken) {
                Alert.alert("Google sign-in failed", "Not able to fetch user data from google Account");
                return;
              }

              let res = await googleLogin({idToken: userInfo.data.idToken});
              if(!res.data?.token) {
                Alert.alert("Google sign-in failed", "Token not received from server");
                return;
              }

              await login(res.data?.token);
              await AsyncStorage.setItem("user", JSON.stringify(res.data.userData));
              let response = await autoAdd({email: res.data.userData.email}).unwrap();
              if(errorAutoAddFriends) {
                console.log("error auto adding friends", errorAutoAddFriends);
              }
              router.push("/(tabs)");
            } catch (error: any) {
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log("User cancelled the login");
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                Alert.alert("Google sign-in", "Sign-in in progress");
                console.log("User sign-in in progress already");
              } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log("play services are not available or outdated");
                Alert.alert("Google sign-in", "Play services are not available\ntry after some time");
              } else {
                // some other error happened
                console.log(error);
                Alert.alert("Google sign-in failed", "Please try after some time");
              }
            }
          }}
        />
        </View>
    );
};

export default GoogleButton;