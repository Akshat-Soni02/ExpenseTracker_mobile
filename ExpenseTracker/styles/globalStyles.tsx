import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  topRight:{
    position: "absolute",
    top: 50,
    right:20,
    fontSize: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
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