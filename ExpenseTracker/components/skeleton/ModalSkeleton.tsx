import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { View, StyleSheet } from "react-native";

const ModalSkeleton = () => {
  return (
    <SkeletonPlaceholder>
        <View style= {{width: "100%"}}>
            {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.modalItem}/>
            ))}
        </View>
  </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  modalItem: { paddingVertical: 15, flexDirection: "row", width: "100%", paddingHorizontal: 10 },
});

export default ModalSkeleton;
