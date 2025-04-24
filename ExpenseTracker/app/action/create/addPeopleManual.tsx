// import React, { useState } from "react";
// import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
// import { useRouter } from "expo-router";

// import { useAddUserFriendsMutation, useGetUserFutureFriendsQuery } from "@/store/userApi";
// import { globalStyles } from "@/styles/globalStyles";


// const AddEmailManuallyScreen = () => {
//   const router = useRouter();
//   const [emails, setEmails] = useState<string[]>([""]);

//   const [addFriends, { isLoading, error: errorFriend }] = useAddUserFriendsMutation();
//   const {data: dataFriends, isLoading: isLoadingFriends, error: errorFutureFriends} = useGetUserFutureFriendsQuery();

//   // handle updating filled emails
//   const handleEmailChange = (index: number, value: string) => {
//     const updatedEmails = [...emails];
//     updatedEmails[index] = value;
//     setEmails(updatedEmails);
//   };

//   const handleAddEmailField = () => {
//     setEmails([...emails, ""]);
//   };

//   const handleSubmit = async () => {
//     const finalData = emails
//       .filter((email) => email.trim() !== "")
//       .map((email) => ({ email }));

//     if (finalData.length === 0) {
//       return;
//     }

//     try {
//       await addFriends({ invitees: finalData }).unwrap();
//       router.back();
//     } catch (error) {
//       Alert.alert("Error adding friends", `Please try after some time`);
//       console.log("Error adding friends: ", error);
//     }
//   };

//   if (isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

//   if (errorFriend) {
//     let errorMessage = "An unknown error occurred";
  
//     if ("status" in errorFriend) {
//       errorMessage = `Server Error: ${JSON.stringify(errorFriend.data)}`;
//     } else if ("message" in errorFriend) {
//       errorMessage = `Client Error: ${errorFriend.message}`;
//     }
//     return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
//       <FlatList
//         data={emails}
//         keyExtractor={(_, index) => index.toString()}
//         renderItem={({ item, index }) => (
//           <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
//             <TextInput
//               placeholder="Enter email"
//               value={item}
//               onChangeText={(text) => handleEmailChange(index, text)}
//               style={{
//                 backgroundColor: "white",
//                 borderWidth: 1,
//                 borderColor: "#d1d5db",
//                 borderRadius: 8,
//                 padding: 10,
//                 fontSize: 16,
//                 color: "#333",
//               }}
//             />
//           </View>
//         )}
//       />

//       {/* Button to add more email fields */}
//       <TouchableOpacity
//         onPress={handleAddEmailField}
//         style={{
//           alignSelf: "flex-start",
//           marginTop: 10,
//           paddingVertical: 8,
//         }}
//       >
//         <Text style={{ color: "#007bff", fontSize: 16, fontWeight: "bold" }}>+ Add Another Email</Text>
//       </TouchableOpacity>

//       {/* Submit button */}
//       <TouchableOpacity
//         onPress={() =>
//           Alert.alert(
//             "Add Friends",
//             "This will send an invitation email to all entered addresses!",
//             [
//               { text: "Cancel", style: "cancel" },
//               { text: "Yes", onPress: handleSubmit },
//             ]
//           )
//         }
//         style={{
//           backgroundColor: "#007bff",
//           padding: 14,
//           borderRadius: 10,
//           alignItems: "center",
//           marginTop: 20,
//         }}
//       >
//         <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Submit</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default AddEmailManuallyScreen;

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";

import { useAddUserFriendsMutation, useGetUserFutureFriendsQuery } from "@/store/userApi";
import { globalStyles } from "@/styles/globalStyles";

const AddEmailManuallyScreen = () => {
  const router = useRouter();
  const [emails, setEmails] = useState<string[]>([""]);

  const [addFriends, { isLoading, error: errorFriend }] = useAddUserFriendsMutation();
  const { data: dataFriends, isLoading: isLoadingFriends, error: errorFutureFriends } = useGetUserFutureFriendsQuery();
  console.log(dataFriends);

  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      Animated.timing(animatedHeight, {
        toValue: (dataFriends?.data?.length ?? 0) * 24 + 10,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handleAddEmailField = () => {
    setEmails([...emails, ""]);
  };

  const handleSubmit = async () => {
    const finalData = emails
      .filter((email) => email.trim() !== "")
      .map((email) => ({ email }));

    if (finalData.length === 0) return;

    try {
      await addFriends({ invitees: finalData }).unwrap();
      router.back();
    } catch (error) {
      Alert.alert("Error adding friends", `Please try after some time`);
      console.log("Error adding friends: ", error);
    }
  };

  if (isLoading)
    return (
      <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <ActivityIndicator color="#000" />
      </View>
    );

  if (errorFriend) {
    let errorMessage = "An unknown error occurred";
    if ("status" in errorFriend) errorMessage = `Server Error: ${JSON.stringify(errorFriend.data)}`;
    else if ("message" in errorFriend) errorMessage = `Client Error: ${errorFriend.message}`;
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  const invitedEmails = dataFriends?.data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      {/* Invited Friends Card */}
      <View
        style={{
          backgroundColor: "#f0f4ff",
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#cbd5e1",
        }}
      >
        <TouchableOpacity onPress={toggleExpand}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1d4ed8" }}>
            Invited Friends ({invitedEmails.length})
          </Text>
        </TouchableOpacity>

        {isLoadingFriends && (
          <ActivityIndicator size="small" color="#1d4ed8" style={{ marginTop: 10 }} />
        )}

        {errorFutureFriends && (
          <Text style={{ color: "red", marginTop: 10 }}>Error loading invited friends.</Text>
        )}

        <Animated.View style={{ overflow: "hidden", height: animatedHeight, marginTop: 8 }}>
          {expanded &&
            invitedEmails.map((item, index) => (
              <Text key={index} style={{ color: "#333", paddingVertical: 2 }}>
                • {item.email}
              </Text>
            ))}
        </Animated.View>
      </View>

      {/* Email Fields */}
      <FlatList
        data={emails}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
            <TextInput
              placeholder="Enter email"
              value={item}
              onChangeText={(text) => handleEmailChange(index, text)}
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 8,
                padding: 10,
                fontSize: 16,
                color: "#333",
              }}
            />
          </View>
        )}
        ListFooterComponent={
          <>
            <TouchableOpacity
              onPress={handleAddEmailField}
              style={{
                alignSelf: "flex-start",
                marginTop: 10,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: "#007bff", fontSize: 16, fontWeight: "bold" }}>
                + Add Another Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Add Friends",
                  "This will send an invitation email to all entered addresses!",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: handleSubmit },
                  ]
                )
              }
              style={{
                backgroundColor: "#007bff",
                padding: 14,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
};

export default AddEmailManuallyScreen;