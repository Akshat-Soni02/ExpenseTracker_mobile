import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { Icon, CloseIcon, CheckCircleIcon, HelpCircleIcon, InfoIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

type ToastType = "success" | "error" | "warning" | "info" | "progress";

interface CustomToastProps {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
  onClose?: () => void;
  onRetry?: () => void;
}

const iconMap = {
  success: CheckCircleIcon,
  error: HelpCircleIcon,
  warning: HelpCircleIcon,
  info: InfoIcon,
  progress: ActivityIndicator, // fallback to loader for progress
};

const colorMap = {
  success: "#22c55e", // green
  error: "#ef4444",   // red
  warning: "#facc15", // yellow
  info: "#3b82f6",    // blue
  progress: "#6b7280", // gray
};

export const CustomToast: React.FC<CustomToastProps> = ({
  id,
  type,
  title,
  description,
  onClose,
  onRetry,
}) => {
  const IconComponent = iconMap[type];
  const iconColor = colorMap[type];

  return (
    <View style={styles.toastContainer}>
      <HStack space="md" style={{ flex: 1, alignItems: "center" }}>
        {type === "progress" ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <Icon as={IconComponent} size="md" style={{ color: iconColor }} />
        )}

        <VStack space="xs" style={{ flex: 1 }}>
          <Text style={[styles.title, { color: iconColor }]}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </VStack>

        <HStack space="sm" style={{ alignItems: "center" }}>
          {onRetry && type !== "progress" && (
            <Button variant="link" size="sm">
              <ButtonText onPress={onRetry}>Retry</ButtonText>
            </Button>
          )}
          {onClose && (
            <Pressable onPress={onClose}>
              <Icon as={CloseIcon} size="sm" />
            </Pressable>
          )}
        </HStack>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
    toastContainer: {
      backgroundColor: "white",
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 16,
      marginVertical: 8,
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      maxWidth: 400,
      width: "90%",
      alignSelf: "center",
  
      // ✅ Fixes full height issue
      flexDirection: "row",
      alignItems: "center",
    },
  });
  


// Just for debugging
// export const CustomToast = ({ title = "Title", description = "Desc", onClose }: any) => {
//     return (
//       <View style={{
//         position: "absolute",
//         top: 60,
//         left: 20,
//         right: 20,
//         backgroundColor: "black",
//         padding: 16,
//         borderRadius: 8,
//         zIndex: 9999,
//         width: 200,
//         alignSelf: "center"
//       }}>
//         <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{title}</Text>
//         <Text style={{ color: "white" }}>{description}</Text>
//       </View>
//     );
//   };
  
