import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const EmailInputScreen = () => {
  const router = useRouter();
  const { contacts } = useLocalSearchParams();
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

  const handleSubmit = () => {
    const finalData = parsedContacts.map((contact) => ({
      name: contact.displayName,
      phone: contact.phoneNumbers[0]?.number || "",
      email: emailData[contact.recordID] || "",
    }));
    console.log("Final Selected Friends with Emails:", finalData);
    router.back(); // Go back after submission
  };

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
        onPress={handleSubmit}
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