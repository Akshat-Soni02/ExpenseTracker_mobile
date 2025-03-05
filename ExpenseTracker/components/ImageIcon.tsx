import React from "react";
import { View, Image, StyleSheet,Text } from "react-native";

interface ImageIconProps {
  imageUrl?: string; // URL of the profile image
  size?: number; // Size of the circle
  imagetitle?: string; // Title of the image
}

const ImageIcon: React.FC<ImageIconProps> = ({ imageUrl, size = 100,imagetitle }) => {
  // Function to generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: imageUrl ? 'transparent' : getRandomColor() }]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : null}
      </View>
      {imagetitle ? <Text style={styles.title}>{imagetitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Center the circle and text horizontally
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#355C7D", // Optional border color
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50, // Half of the size to make it circular
  },
  title: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
});

export default ImageIcon;