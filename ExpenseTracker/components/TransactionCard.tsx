import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ImageIcon from "./ImageIcon"; // Adjust the import path as necessary

interface TransactionCardProps {
  imageName?: string; // Name of the profile image
  title: string; // Title of the card
  subtitle?: string; // Optional subtitle
  amount: string; // Amount text
  optionText?: string; // Optional text above the amount
}

const TransactionCard: React.FC<TransactionCardProps> = ({ imageName, title, subtitle, amount, optionText }) => {
  return (
    <View style={styles.card}>
      {imageName&&<ImageIcon size={50} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.amountContainer}>
        {optionText && <Text style={styles.optionText}>{optionText}</Text>}
        <Text style={styles.amount}>{amount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  optionText: {
    fontSize: 12,
    color: "#999",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#355C7D",
  },
});

export default TransactionCard;