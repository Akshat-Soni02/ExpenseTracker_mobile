import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { Pressable } from "react-native";
import { COLORS, FONTS } from "@/app/utils/constants";

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
  subtitleStyle?: object;
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
  amountStyle,
  subtitleStyle
}) => {
  const isDebit = transactionType === "debit" || transactionType === "expense";
  const isCredit = transactionType === "credit" || transactionType === "income";

  const scaleAnim = useRef(new Animated.Value(1)).current;
  let touchStartY = 0;

  const handlePressIn = (e) => {
    touchStartY = e.nativeEvent.pageY;

    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = (e) => {
    const touchEndY = e.nativeEvent.pageY;
    const movement = Math.abs(touchEndY - touchStartY);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start(() => {
      if (movement < 5 && pressFunction) pressFunction();
    });
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.transactionItem, cardStyle, { transform: [{ scale: scaleAnim }] }]}>
        {imageName && <Image source={{ uri: imageName }} style={styles.profileImage} />}

        {imageType && (
          <Feather name={imageType === "expense" ? "arrow-up-right" : "arrow-down-left"}
          size={25}
          color={imageType === "expense" ? COLORS.amount.negative : COLORS.amount.positive} />
        )}

        <View style={[styles.transactionDetails, (imageName || imageType) && {marginLeft: 10}]}>
          <Text style={styles.transactionTitle} numberOfLines={1}>{title}</Text>
          {subtitle && (
            <Text style={[styles.transactionSubtitle, subtitleStyle]} numberOfLines={1}>
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
                color: isCredit ? COLORS.amount.positive : isDebit ? COLORS.amount.negative : "black"
              }
            ]}
          >
            {amount}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.secondary,
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
    gap: 3,
  },
  transactionTitle: {
    fontSize: FONTS.medium,
    fontWeight: "400",
  },
  transactionSubtitle: {
    color: COLORS.text.secondary,
    fontSize: FONTS.small,
  },
  amountDetails: {
    flex: 1,
    alignItems: "flex-end"
  },
  transactionAmount: {
    fontSize: FONTS.medium,
    fontWeight: "semibold"
  },
  topAmountText: {
    color: COLORS.text.secondary,
    fontSize: FONTS.vsmall
  }
});

export default TransactionCard;
