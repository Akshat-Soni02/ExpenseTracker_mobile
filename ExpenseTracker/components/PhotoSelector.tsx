import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Controller, Control } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";


interface Props {
    control: Control<any>;
  }

  const PhotoSelector: React.FC<Props> = ({ control }) => {
    const [uploadedFile, setUploadedFile] = useState("");

    const getMediaPath = async (imageUri: string) => {
      try {
        const fileUri = imageUri.replace("file://", "");
        console.log("Valid file path:", fileUri);
        return fileUri;
      } catch (error) {
        console.error("Error processing file path:", error);
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
              <>
              <Text style={styles.label}>Add Photo</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
                  if (!result.canceled) {
                    onChange(getMediaPath(result.assets[0].uri));
                    setUploadedFile(result.assets[0].uri);
                  }
                }}
              >
                {/* {value && <Image source={{ uri: value }} style={styles.image} />} */}
                <Text>Select Photo</Text>
              </TouchableOpacity>
              </>
            ) : (
              <>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
                if (!result.canceled) {
                  onChange(getMediaPath(result.assets[0].uri));
                  setUploadedFile(result.assets[0].uri);
                }
              }}
            >
              {value && <Image source={{ uri: uploadedFile }} style={styles.image} />}
              {/* <Text>Select Photo</Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeButton} onPress={() => onChange(null)}>
                {/* <Text style={styles.removeText}>✕</Text> */}
                <Ionicons name="close-circle" size={20} color="black" />
            </TouchableOpacity>
          </>
            )}
            
            {/* {value && <Image source={{ uri: value }} style={styles.image} />} */}
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingInline: 10,
    width: "50%",
    height: "100%",
    justifyContent: "center",
  },
  // container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold" },
  button: { borderWidth: 0, paddingVertical: 5, borderRadius: 5},
  image: { width: 100, height: 100, marginTop: 10 },
  removeButton: {
        position: "absolute",
        top: 5,
        right: 5,
        // backgroundColor: "rgba(255, 0, 0, 0.7)",
        // borderRadius: 12,
        // width: 24,
        // height: 24,
        justifyContent: "center",
        alignItems: "center",
      },
      removeText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
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
