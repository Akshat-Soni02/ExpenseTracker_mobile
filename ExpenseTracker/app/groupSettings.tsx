import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const GroupSettings = ({ group }) => {
  const router = useRouter();

  const handleEditGroup = () => {
    router.push({ pathname: "../editGroup", params: { id: group._id } });
  };

  const handleLeaveGroup = () => {
    // Handle leave group logic
  };

  return (
    <View style={styles.container}>
      {/* Members List */}
      <Text style={styles.sectionTitle}>Members</Text>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text style={styles.memberName}>{item.name}</Text>
          </View>
        )}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditGroup}>
          <Text style={styles.buttonText}>Edit Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
          <Text style={styles.buttonText}>Leave Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  memberItem: {
    padding: 10,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  leaveButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GroupSettings;