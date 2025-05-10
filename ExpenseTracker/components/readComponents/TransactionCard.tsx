import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';

interface TransactionCardProps {
  imageName?: string;
  title: string;
  subtitle?: string | null | Date;
  amount?: string;
  optionText?: string;
  imageType?: string;
  transactionType?: string;
  pressFunction?: any;
  cardStyle?: object;
  amountStyle?: object;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  imageName,
  title,
  subtitle,
  amount,
  optionText,
  imageType,
  transactionType,
  pressFunction,
  cardStyle,
  amountStyle
}) => {
  const isDebit = transactionType === "debit" || transactionType === "expense";
  const isCredit = transactionType === "credit" || transactionType === "income";

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start(() => {
      if (pressFunction) pressFunction();
    });
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.transactionItem, cardStyle, { transform: [{ scale: scaleAnim }] }]}>
        {imageName && <Image source={{ uri: imageName }} style={styles.profileImage} />}

        {imageType && (
          <Feather name={isDebit ? "arrow-up-right" : "arrow-down-left"}
          size={25}
          color={isDebit ? "#d86161" : "#1e9738"} />
        )}

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle} numberOfLines={1}>{title}</Text>
          {subtitle && (
            <Text style={styles.transactionSubtitle} numberOfLines={1}>
              {subtitle.toString()}
            </Text>
          )}
        </View>

        <View style={styles.amountDetails}>
          {optionText && <Text style={styles.topAmountText}>{optionText}</Text>}
          <Text
            style={[
              styles.transactionAmount,
              amountStyle,
              {
                color: isCredit ? "#1e9738" : isDebit ? "#d86161" : "black"
              }
            ]}
          >
            {amount}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginBottom: 2
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10
  },
  transactionTitle: {
    fontSize: 17,
    fontWeight: "400"
  },
  transactionSubtitle: {
    color: "#888",
    fontSize: 12
  },
  amountDetails: {
    flex: 1,
    alignItems: "flex-end"
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: "bold"
  },
  topAmountText: {
    color: "#888",
    fontSize: 12
  }
});

export default TransactionCard;
