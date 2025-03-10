// // app/addSplitPeople.tsx
// import React from "react";
// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { selectUser, deselectUser } from "../slices/userSlice";
// import { useRouter } from "expo-router";

// const UserSelectionPage = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const users = useSelector((state) => state.users.users); 
//   const selectedUsers = useSelector((state) => state.users.selectedUsers);

//   const toggleUserSelection = (user) => {
//     if (selectedUsers.includes(user.id)) {
//       dispatch(deselectUser(user.id));
//     } else {
//       dispatch(selectUser(user.id));
//     }
//   };

//   return (
//     <View>
//       <FlatList
//         data={users}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => toggleUserSelection(item)}>
//             <Text style={{ padding: 10, backgroundColor: selectedUsers.includes(item.id) ? "lightblue" : "white" }}>
//               {item.name}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//       <TouchableOpacity onPress={() => router.back()}>
//         <Text style={{ padding: 10, backgroundColor: "blue", color: "white" }}>Done</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default UserSelectionPage;
