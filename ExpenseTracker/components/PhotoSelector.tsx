import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Controller, Control } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  control: Control<any>;
}

const PhotoSelector: React.FC<Props> = ({ control }) => {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");

  const pickImage = async (onChange: (uri: string) => void) => {
    setLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        onChange(imageUri);
        setUploadedFile(imageUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="photo"
        defaultValue={null}
        render={({ field: { onChange, value } }) => (
          <>
            {!value ? (
              <TouchableOpacity style={styles.selectContainer} onPress={() => pickImage(onChange)}>
                {loading ? (
                  <ActivityIndicator size="small" color="#555" />
                ) : (
                  <>
                    <Ionicons name="image-outline" size={22} color="#555" />
                    <Text style={styles.selectText}>Photo</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.imageContainer}>
                <Image source={{ uri: uploadedFile }} style={styles.image} />
                <TouchableOpacity style={styles.removeButton} onPress={() => onChange(null)}>
                  <Ionicons name="close-circle" size={18} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   width: "50%",
  //   alignItems: "center",
  // },
  container: {
    width: "50%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(150, 150, 150, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: "100%",
  },
  selectText: {
    fontSize: 14,
    marginLeft: 6,
    color: "#555",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 110,
    borderRadius: 6,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 2,
  },
});

export default PhotoSelector;

// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Controller, Control } from "react-hook-form";

// interface Props {
//   control: Control<any>;
// }

// const PhotoSelector: React.FC<Props> = ({ control }) => {
//   return (
//     <Controller
//       control={control}
//       name="photo"
//       defaultValue={null}
//       render={({ field: { onChange, value } }) => (
//         <View style={styles.container}>
//           {console.log("Current Image Value:", value)} {/* ✅ Debugging log */}

//           {/* If no image is selected, show the "Select Photo" button */}
//           {!value ? (
//             <>
//               <Text style={styles.label}>Add Photo</Text>
//               <TouchableOpacity
//                 style={styles.button}
//                 onPress={async () => {
//                   let result = await ImagePicker.launchImageLibraryAsync({
//                     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                     allowsEditing: true,
//                     aspect: [4, 3],
//                     quality: 1,
//                   });

//                   if (!result.canceled) {
//                     console.log("Selected Image URI:", result.assets[0].uri); // ✅ Debugging log
//                     onChange(result.assets[0].uri); // ✅ Set the selected image
//                   }
//                 }}
//               >
//                 <Text style={styles.buttonText}>Select Photo</Text> {/* ✅ FIXED */}
//               </TouchableOpacity>
//             </>
//           ) : (
//             <>
//               {/* Selected Image */}
//               <TouchableOpacity
//                 onPress={async () => {
//                   let result = await ImagePicker.launchImageLibraryAsync({
//                     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                     allowsEditing: true,
//                     aspect: [4, 3],
//                     quality: 1,
//                   });

//                   if (!result.canceled) {
//                     console.log("Updated Image URI:", result.assets[0].uri); // ✅ Debugging log
//                     onChange(result.assets[0].uri);
//                     console.log(value);
//                   }
//                 }}
//               >
                
//                 {value && <Image source={{ uri: value }} style={styles.image} />}
//               </TouchableOpacity>
//               {/* Remove Button */}
//               <TouchableOpacity style={styles.removeButton} onPress={() => onChange(null)}>
//                 <Text style={styles.removeText}>✕</Text> {/* ✅ FIXED */}
//               </TouchableOpacity>
//             </>
//           )}
//           <Image source={{uri: "file:///data/user/0/com.searce.splitexpensetracker/cache/ImagePicker/4c7009c2-2a4e-4fa0-a85a-d681a90eb52a.jpeg"}}/>
//         </View>
//       )}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 2,
//     borderRadius: 15,
//     backgroundColor: "rgba(200, 230, 255, 0.4)",
//     borderColor: "rgba(255, 255, 255, 0.2)",
//     padding: 10,
//     width: 150,
//     height: 150,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   button: {
//     backgroundColor: "rgba(100, 100, 255, 0.2)",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: "#333",
//     fontSize: 16,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 12,
//     resizeMode: "cover",
//   },
//   removeButton: {
//     position: "absolute",
//     top: 5,
//     right: 5,
//     backgroundColor: "rgba(255, 0, 0, 0.7)",
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   removeText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default PhotoSelector;
