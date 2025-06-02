import React, { createContext, useContext, useRef, useState } from "react"
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type ToastType = "success" | "error" | "warning" | "info"

interface ToastOptions {
  title: string
  message?: string
  type?: ToastType
  duration?: number
}

const ToastContext = createContext<{
  showToast: (options: ToastOptions) => void
} | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false)
  const [toast, setToast] = useState<ToastOptions | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const showToast = ({
    title,
    message,
    type = "info",
    duration = 3000,
  }: ToastOptions) => {
    setToast({ title, message, type })
    setVisible(true)

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start()

    if (duration > 0) {
      setTimeout(() => {
        hideToast()
      }, duration)
    }
  }

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false)
    })
  }

  const getIcons = {
    success: <MaterialCommunityIcons name="check-circle" size={20} color="#22c55e" />,
    error: <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />,
    warning: <MaterialCommunityIcons name="alert" size={20} color="#f59e0b" />,
    info: <MaterialCommunityIcons name="information" size={20} color="#3b82f6" />,
  }

  const getStyles = (type: ToastType) => {
    const map = {
      success: {
        bg: "rgba(209, 250, 229, 0.8)",
        icon: "✓",
        iconColor: "#22c55e",
      },
      error: {
        bg: "rgba(254, 202, 202, 0.8)",
        icon: "⚠️",
        iconColor: "#ef4444",
      },
      warning: {
        bg: "rgba(254, 243, 199, 0.8)",
        icon: "⚠️",
        iconColor: "#f59e0b",
      },
      info: {
        bg: "rgba(191, 219, 254, 0.8)",
        icon: "ℹ️",
        iconColor: "#3b82f6",
      },
    }
    return map[type]
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && toast && (
        <Animated.View
          style={[
            styles.toastContainer,
            { opacity: fadeAnim },
          ]}
        >
          <View
            style={[
              styles.toastBox,
              {
                backgroundColor: getStyles(toast.type!).bg,
                ...(Platform.OS === "web" && {
                  backdropFilter: "blur(10px)",
                }),
              },
            ]}
          >
            <View style={styles.iconWrapper}>
              <View style={styles.whiteCircle}>
                {getIcons[toast.type]}
              </View>
            </View>
            <View style={styles.textWrapper}>
                <Text style={styles.title}>{toast.title}</Text>
                {toast.message ? (
                    <Text style={styles.message}>{toast.message}</Text>
                ) : null}
            </View>
            <TouchableOpacity onPress={hideToast}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 75,
    alignSelf: "center",
    zIndex: 9999,
    width: "90%",
  },
  toastBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 10,
  },
  iconWrapper: {
    marginRight: 10,
  },
  whiteCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    color: "#111",
  },
  message: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
  closeBtn: {
    fontSize: 16,
    color: "#777",
    paddingLeft: 8,
  },
})