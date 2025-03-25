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