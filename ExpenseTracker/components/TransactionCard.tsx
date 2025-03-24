import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import ImageIcon from "./ImageIcon"; // Adjust the import path as necessary
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Divider} from 'react-native-paper';
interface TransactionCardProps {
  imageName?: string; // Name of the profile image
  title: string; // Title of the card
  subtitle?: string; // Optional subtitle
  amount?: string; // Amount text
  optionText?: string; // Optional text above the amount
  imageType?:string;
  transactionType?:string;
  pressFunction?:any;
  cardStyle?: object;
  amountStyle?: object;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ imageName, title, subtitle, amount, optionText,imageType,transactionType, pressFunction, cardStyle, amountStyle }) => {
  const isDebit = (transactionType === "debit" || transactionType === "expense");
  const isCredit = (transactionType === "credit" || transactionType === "income");
  return (
    // <View style={styles.card}>
    //   {imageName&&<ImageIcon size={50} />}
    //   <View style={styles.textContainer}>
    //     <Text style={styles.title}>{title}</Text>
    //     {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    //   </View>
    //   <View style={styles.amountContainer}>
    //     {optionText && <Text style={styles.optionText}>{optionText}</Text>}
    //     <Text style={styles.amount}>{amount}</Text>
    //   </View>
    // </View>
    <TouchableOpacity onPress={pressFunction}>
    <View style={[styles.transactionItem, cardStyle]} >
      {imageName && <Image source={{ uri: imageName }} style={styles.profileImage} />}
      {imageType&&<MaterialCommunityIcons
        name={isDebit ? "arrow-top-right" : "arrow-bottom-left"}
        size={20}
        color={isDebit ? "red" : "green"}
      />}
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle} numberOfLines={1}>{title}</Text>
        {subtitle && (<Text style={styles.transactionSubtitle} numberOfLines={1}>{subtitle}</Text>)}
      </View>
      <View style={styles.amountDetails}>
        {optionText&&<Text style={styles.topAmountText}>{optionText}</Text>}
        <Text
          style={[
            styles.transactionAmount,
            amountStyle,
            { 
              color: isCredit
                ? "green" 
                : isDebit
                ? "red" 
                : "black" // Default color if transactionType is undefined
            }
          ]}
        >
          {amount}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
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
    elevation: 2, 
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25
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
  transactionItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    backgroundColor: "#f8f9fa", 
    borderRadius: 10, 
    marginBottom: 2 
  },
  transactionDetails: { 
    flex: 1,
    marginLeft: 10 
  },
  amountDetails:{
    flex:1,
    alignItems:"flex-end"
  },
  transactionTitle: { 
    fontSize: 16 
  },
  transactionSubtitle: { 
    color: "#888", 
    fontSize: 12 
  },
  transactionAmount: { 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  topAmountText:{
    color: "#888", 
    fontSize: 12 
  },
});

export default TransactionCard;