import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAddUserFriendsMutation } from "@/store/userApi";

const EmailInputScreen = () => {
  const router = useRouter();
  const { contacts } = useLocalSearchParams();
  const [addFriends, {isLoading}] = useAddUserFriendsMutation();
  const parsedContacts = contacts ? JSON.parse(contacts) : [];

  const [emailData, setEmailData] = useState(
    parsedContacts.reduce((acc, contact) => {
      acc[contact.recordID] = "";
      return acc;
    }, {})
  );

  const handleEmailChange = (recordID, email) => {
    setEmailData((prev) => ({
      ...prev,
      [recordID]: email,
    }));
  };

  const handleSubmit = async () => {
    const finalData = parsedContacts.map((contact) => ({
      name: contact.displayName,
      phone: contact.phoneNumbers[0]?.number || "",
      email: emailData[contact.recordID] || "",
    }));
    console.log("Final Selected Friends with Emails:", finalData);
    try {
      const response = await addFriends({invitees: finalData}).unwrap();
      router.replace("/(tabs)");
    } catch (error) {
      console.log("error adding friends: ", error);
    }
  };

  if(isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      <FlatList
        data={parsedContacts}
        keyExtractor={(item) => item.recordID}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
            <Text style={{ fontSize: 16, fontWeight: "500", color: "black" }}>
              {item.displayName || "Unknown"}
            </Text>
            {item.phoneNumbers.length > 0 && (
              <Text style={{ fontSize: 14, color: "gray" }}>
                {item.phoneNumbers[0].number}
              </Text>
            )}
            <TextInput
              placeholder="Enter email"
              value={emailData[item.recordID]}
              onChangeText={(text) => handleEmailChange(item.recordID, text)}
              style={{
                marginTop: 8,
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
      />

      <TouchableOpacity
        onPress={() => Alert.alert(
                      "Add friends", 
                      "This will send a email to all your friends who are not currently on ExpenseEase!", 
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Yes", onPress: () => handleSubmit()}
                      ]
                    )}
        style={{
          backgroundColor: "#007bff",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmailInputScreen;