import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  categoryName: string;
};

const CategoryActionSheet: React.FC<Props> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  categoryName,
}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>{categoryName}</Text>
        <TouchableOpacity onPress={onEdit} style={styles.option}>
          <Text style={styles.optionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.option, styles.delete]}>
          <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.cancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CategoryActionSheet;


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    sheet: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
        color: "#333",
    },
    option: {
        paddingVertical: 12,
    },
    delete: {
        borderTopWidth: 1,
        borderColor: "#eee",
        marginTop: 10,
    },
    optionText: {
        fontSize: 16,
    },
    cancel: {
        marginTop: 15,
        paddingVertical: 12,
        alignItems: "center",
    },
    cancelText: {
        fontSize: 16,
        color: "#666",
    },
});
  