import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
WebBrowser.maybeCompleteAuthSession();

const GoogleLoginButton = () => {

    
    const [userInfo, setUserInfo] = useState(null);

    //client IDs from .env
    const config = {
        androidClientId: "41930990796-8blks6de5mo4023v2rgj83hlcgr5cshj.apps.googleusercontent.com",
        // iosClientId: IOS_CLIENT_ID,
        webClientId: "41930990796-v0crd8n8lnpnolcjuqgd9do6mm4cfe5b.apps.googleusercontent.com",
    };

    const [request, response, promptAsync] = Google.useAuthRequest(config);

    const getUserInfo = async (token) => {
        //absent token
        if (!token) return;
        //present token
        try {
          const response = await fetch(
            "https://www.googleapis.com/userinfo/v2/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const user = await response.json();
          //store user information  in Asyncstorage
          await AsyncStorage.setItem("Testuser", JSON.stringify(user));
          setUserInfo(user);
        } catch (error) {
          console.error(
            "Failed to fetch user data:",
            response.status,
            response.statusText
          );
        }
      };

      const signInWithGoogle = async () => {
        try {
          // Attempt to retrieve user information from AsyncStorage
          const userJSON = await AsyncStorage.getItem("Testuser");
      
          if (userJSON) {
            // If user information is found in AsyncStorage, parse it and set it in the state
            setUserInfo(JSON.parse(userJSON));
          } else if (response?.type === "success") {
            // If no user information is found and the response type is "success" (assuming response is defined),
            // call getUserInfo with the access token from the response
            getUserInfo(response.authentication.accessToken);
          }
          router.push("/(tabs)");
        } catch (error) {
          // Handle any errors that occur during AsyncStorage retrieval or other operations
          console.error("Error retrieving user data from AsyncStorage:", error);
        }
      };
      
      //add it to a useEffect with response as a dependency 
      useEffect(() => {
        signInWithGoogle();
      }, [response]);
      
      //log the userInfo to see user details
      console.log(JSON.stringify(userInfo))


    return (
        <View style = {styles.container}>
            <TouchableOpacity onPress={()=>{promptAsync()}}><Text style={{color: "white"}}>Google login</Text></TouchableOpacity>
        </View>
    );
}

export default GoogleLoginButton;

const styles = StyleSheet.create({
    container: {
        padding: 2,
        borderRadius: 5,
        backgroundColor: "grey",
        width: 100,
        textAlign: "center",
    }
});