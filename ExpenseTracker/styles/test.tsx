import { Dimensions, StyleSheet } from "react-native";
import { COLORS, FONTS } from "@/app/utils/constants";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");


export const testStyles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor: "#ffffff"
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        gap: 20,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    horizontalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    verticalContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
    },
    actionContainer: {
        alignItems: "center",
        gap: 7
    },
    actionCircle: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: COLORS.button.primary.background
    },
    actionText: {
        fontSize: FONTS.small,
        color: COLORS.button.primary.text,
        fontWeight: "500",
        lineHeight: 14,
    },
    centeredBox: {
        justifyContent: "center",
        alignItems: "center"
    },
    // these are used in create components
    primaryBorderBox: {
        borderRadius: 15,
        backgroundColor: COLORS.primary
    },
    transactionalCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: COLORS.secondary,
        borderRadius: 10
    },
    recordRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        backgroundColor: "#FFF",
    }
});