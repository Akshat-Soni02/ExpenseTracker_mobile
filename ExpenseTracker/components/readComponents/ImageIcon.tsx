import React from "react";
import { View, Image, StyleSheet,Text } from "react-native";

interface ImageIconProps {
  imageUrl?: string;
  size?: number;
  imagetitle?: string;
}

const ImageIcon: React.FC<ImageIconProps> = ({ imageUrl, size = 100,imagetitle }) => {

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
    alignItems: 'center',
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#355C7D",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  title: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
});

export default ImageIcon;