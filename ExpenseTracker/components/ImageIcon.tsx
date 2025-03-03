import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface ImageIconProps {
  imageUrl?: string; // URL of the profile image
  size?: number; // Size of the circle
}

const ImageIcon: React.FC<ImageIconProps> = ({ imageUrl, size = 100 }) => {
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
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: imageUrl ? 'transparent' : getRandomColor() }]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ImageIcon;