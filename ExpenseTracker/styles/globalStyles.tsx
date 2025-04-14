import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  screen:{
    flex:1
},
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },

  viewContainer: {
    flex: 1,
    padding: 20,
    // backgroundColor: "#F9FAFB",
    backgroundColor: "#fff",
  },
  viewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    // backgroundColor: "#F9FAFB",
    backgroundColor: "#fff",
  },
  backButton:{
    padding: 10,
  },
  menuButton:{
    padding: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black"
  },
  viewActivityDetailContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  viewActivityTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  viewActivityAmount: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
  },
  viewActivityAccountName: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  viewActivityDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
  viewActivityNotesContainer: {
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  viewActivityNotesTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#374151",
  },
  viewActivityNotesText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  viewActivitySplitContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 15,
  },
  viewActivityPaidBy: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#374151",
    marginBottom: 5,
  },
  viewActivityOweText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  viewActivityBoldText: {
    fontFamily: "Poppins_700Bold",
  },
  navbar: {
      marginBottom: 20,
      marginTop: 25,
      left : 2,
    },
  
    fab: {
      position: "absolute",
      margin: 16,
      backgroundColor:"#f8f9fa",
      right: 0,
      bottom: 0,
  },
  noText: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    padding: 16,
  },
  saveButton: {
    marginVertical: 15,
    alignSelf: "center",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  walletPhotoContainer: {
    flexDirection: "row",
    // gap: 1,
    width: "100%",
    height: 130,
    justifyContent: "space-between"
  },
  topRight:{
    position: "absolute",
    top: 50,
    right:20,
    fontSize: 20,
  },
  // backButton: {
  //   position: "absolute",
  //   top: 50,
  //   left: 20,
  // },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 10,
  },
  pageMidError: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    textAlignVertical: "center",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

// container: {
//   flex: 1,
//   backgroundColor: "#F9FAFB",
//   padding: 20,
// },

// header: {
//   fontSize: 24,
//   fontWeight: "bold",
//   fontFamily: "Poppins_700Bold",
// },