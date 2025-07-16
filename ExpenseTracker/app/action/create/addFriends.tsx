import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, PermissionsAndroid, Platform, TextInput, TouchableOpacity, Alert, Linking, SafeAreaView } from "react-native";
import Contacts from "react-native-contacts";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Contact } from "react-native-contacts/type";
import { friend, useAddOrCreateDummyMutation } from "@/store/userApi";
import { useToast } from "@/context/ToastContext";
import { globalStyles } from "@/styles/globalStyles";
import { testStyles } from "@/styles/test";
import SearchBar from "@/components/SearchBar";

const ContactsScreen = () => {
  const [contacts, setContacts] = useState<Contact[] | []>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[] | []>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [friendAdded, setFriendAdded] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "whatsapp" | null>(null);

  const { showToast } = useToast();

  const [addFriend, { isLoading, error: errorFriend }] = useAddOrCreateDummyMutation();

  const { people } = useLocalSearchParams() as { people: string };
  const parsedPeople: friend[] = people ? JSON.parse(people) : [];

  const router = useRouter();

  useEffect(() => {
    loadContacts();
  }, []);

  const requestContactsPermission = async () => {
    if (Platform.OS === "android") {
      try {
        //this asks for permission to user
        console.log("Asking contact permission to user");
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
      .then((contactList: Contact[]) => {

        const friendNumbersSet = new Set(
          parsedPeople.map((f) => {
            // Prepend +91 if missing
            const raw = f.phone_number.toString().replace(/[^\d]/g, "");
            return raw.length === 10 ? `91${raw}` : raw; // keep country code if already present
          })
        );
  
        const filtered = contactList.filter((contact) => {
          const numberRaw = contact.phoneNumbers?.[0]?.number;
          if (!numberRaw) return false;
        
          const digitsOnly = numberRaw.replace(/[^\d]/g, ""); // removes +, -, spaces
          return !friendNumbersSet.has(digitsOnly);
        });

        setContacts(filtered);
        setFilteredContacts(filtered);
      })
      .catch((err) => console.warn("Error fetching contacts", err));
  };
  

  const handleSearch = (text: string) => {
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

  const inviteMessage = encodeURIComponent("Hey!\nI'm using this awesome app to manage things better. Thought you'd like it too! Try it out:\nhttps://play.google.com/store/apps/details?id=com.dev.akshat.atharva.expenz&pcampaignid=web_share");

  const handleSendSMS = () => {
    if (!selectedContact) return;
    const phone = getPhoneNumber(selectedContact);
    if (!phone) return Alert.alert("Invalid Contact", "This contact has no phone number.");
    Linking.openURL(`sms:${phone}?body=${inviteMessage}`);
  };
  
  const handleSendWhatsApp = () => {
    if (!selectedContact) return;
    const phone = getPhoneNumber(selectedContact);
    if (!phone) return Alert.alert("Invalid Contact", "This contact has no phone number.");
    Linking.openURL(`https://wa.me/${phone}?text=${inviteMessage}`);

    // Linking.canOpenURL("whatsapp://send").then((supported) => {
    //   if (!supported) {
    //     Alert.alert("WhatsApp not installed");
    //   } else {
    //     Linking.openURL(`whatsapp://send?phone=${phone}&text=${inviteMessage}`);
    //   }
    // });
  };
  
  //prevent them to add the user who is already a friend by filtering with number
  //also send the number without +91 to backend
  //Update all the places in the backend where we are storing the number without country code
  //only show text message send option if user is not in app

  const toggleSelectContact = useCallback((contact: Contact) => {
    setSelectedContact((prev) =>
      prev?.recordID === contact.recordID ? null : contact
    );
    setSelectedMethod(null);
    setFriendAdded(false); // Reset if user changes contact
  }, []);
  
  

  const getPhoneNumber = (contact: Contact) => {
    if (contact.phoneNumbers.length === 0) return null;
    // Remove all non-digit characters (basic sanitization)
    return contact.phoneNumbers[0].number.replace(/[^\d+]/g, "");
  };

  const handleFriendAdd = async () => {
    try {
      const numberRaw = selectedContact.phoneNumbers?.[0]?.number;
      if (!numberRaw) return;
    
      let digitsOnly = numberRaw.replace(/[^\d]/g, "");
      if(digitsOnly.length === 12) digitsOnly = digitsOnly.substring(2);
      const res = await addFriend({ givenName: selectedContact.givenName, phone_num: digitsOnly });
      console.log(res);
      if(res.data.data.isDummy) {
        setFriendAdded(true)
      } else {
        showToast({
          title: `Friend Added`,
          type: "success",
        });
        router.back();
      }
    } catch (error) {
      console.log(error);
      console.log("Friend add error");
    }
  }
  
    

  // const navigateToEmailInput = () => {
  //   const selected = contacts.filter((contact) => selectedContacts.has(contact.recordID));
  //   router.push({ pathname: "/action/create/addPeopleEmail", params: { contacts: JSON.stringify(selected) } });
  // };

  const renderItem = useCallback(({ item }: { item: Contact }) => {
    const isSelected = selectedContact?.recordID === item.recordID;
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
  }, [selectedContact]);
  

  return (
    <SafeAreaView style={testStyles.screen}>
      <View style={[testStyles.container, {gap: 0, marginTop: 40}]}>
        <SearchBar
            placeholder="Search contacts..."
            value={searchQuery}
            onSearch={handleSearch}
          />
        {/* <View
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
        </View> */}

        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.recordID}
          renderItem={renderItem}
          initialNumToRender={20} // only render first 20
          maxToRenderPerBatch={20} // render 20 more per batch
          windowSize={10} // buffer size
          removeClippedSubviews={true} // better perf on Android
          keyboardShouldPersistTaps="handled"
          getItemLayout={(data, index) => ({
            length: 64, // approximate row height
            offset: 64 * index,
            index,
          })}
          extraData={selectedContact}
        />
        {selectedContact && !friendAdded && (
          <TouchableOpacity
            onPress={() => handleFriendAdd()}
            style={{
              backgroundColor: "#28a745",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              ➕ Add Friend
            </Text>
          </TouchableOpacity>
        )}



        {/* {selectedContacts.size > 0 && (
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
        )} */}
        {friendAdded && (
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#333",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              🎉 Friend added! Invite them to join the app:
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => handleSendWhatsApp()}
                style={{
                  backgroundColor: "#25D366",
                  padding: 14,
                  borderRadius: 10,
                  flex: 1,
                  marginRight: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSendSMS()}
                style={{
                  backgroundColor: "#007bff",
                  padding: 14,
                  borderRadius: 10,
                  flex: 1,
                  marginLeft: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>SMS</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ContactsScreen;