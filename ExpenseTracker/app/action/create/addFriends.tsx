import React, { useState, useEffect, useCallback } from "react";
import { 
  View, Text, FlatList, PermissionsAndroid, Platform, TextInput, TouchableOpacity, 
  Alert
} from "react-native";
import Contacts from "react-native-contacts";
import { useRouter } from "expo-router";

const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadContacts();
  }, []);

  const requestContactsPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Access Contacts",
            message: "This app requires access to your contacts to continue.",
            buttonPositive: "Allow",
          }
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert("Permission Denied", "Contacts access is required.");
          return false;
        }
      } catch (error) {
        console.error("Permission request error:", error);
        return false;
      }
    }
    return true;
  };

  const checkAndRequestPermission = async () => {
    if (Platform.OS === "android") {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      
      if (!hasPermission) {
        return requestContactsPermission();
      }
    }
    return true;
  };
  

  const loadContacts = async () => {
    const granted = await checkAndRequestPermission();
    if (!granted) return;
  
    Contacts.getAll()
      .then((contactList) => {
        setContacts(contactList);
        setFilteredContacts(contactList);
      })
      .catch((err) => console.warn("Error fetching contacts", err));
  };
  

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(
        (contact) => contact.displayName && contact.displayName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const toggleSelectContact = useCallback((contact) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contact.recordID)) {
        newSet.delete(contact.recordID);
      } else {
        newSet.add(contact.recordID);
      }
      return newSet;
    });
  }, []);  

  const navigateToEmailInput = () => {
    const selected = contacts.filter((contact) => selectedContacts.has(contact.recordID));
    router.push({ pathname: "/action/create/addPeopleEmail", params: { contacts: JSON.stringify(selected) } });
  };

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedContacts.has(item.recordID);
    return (
      <TouchableOpacity
        onPress={() => toggleSelectContact(item)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          backgroundColor: isSelected ? "#cfe2ff" : "white",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "black" }}>
            {item.displayName || "Unknown"}
          </Text>
          {item.phoneNumbers.length > 0 && (
            <Text style={{ fontSize: 14, color: "gray" }}>
              {item.phoneNumbers[0].number}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [selectedContacts]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 12,
          paddingHorizontal: 14,
          height: 44,
          borderWidth: 1,
          borderColor: "#d1d5db",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          marginBottom: 10,
        }}
      >
        <TextInput
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={{ flex: 1, fontSize: 16, color: "#333" }}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.recordID}
        renderItem={renderItem}
        extraData={selectedContacts}
      />

      {selectedContacts.size > 0 && (
        <TouchableOpacity
          onPress={navigateToEmailInput}
          style={{
            backgroundColor: "#007bff",
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Next ({selectedContacts.size})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ContactsScreen;