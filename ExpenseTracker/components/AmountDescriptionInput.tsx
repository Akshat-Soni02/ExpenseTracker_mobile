import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Controller, Control } from "react-hook-form";
import { BlurView } from "expo-blur";

interface Props {
  control: Control<any>;
  label: string;
  update? : boolean;
}

const AmountDescriptionInput: React.FC<Props> = ({ control, label, update }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountWrapper}>
        <Text style={styles.currency}>₹</Text>
        <Controller
          control={control}
          name="amount"
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={String(value ?? "0")}
              placeholder="0"
              onChangeText={onChange}
              accessibilityLabel="Amount input"
              accessibilityHint="Enter the amount in rupees"
            />
          )}
        />
      </View>
      <View style={styles.separator} />

      {/* Description Section */}
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={label}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
            <TextInput
              style={[styles.descriptionInput, !value && styles.placeholderText]}
              placeholder="Tap to add"
              placeholderTextColor="#A0AEC0"
              value={value}
              onChangeText={onChange}
              accessibilityLabel={`${label} input`}
              accessibilityHint={`Tap to enter a ${label}`}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AmountDescriptionInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)", 
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    // rgba(200, 230, 255, 0.4)
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: "hidden",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    color: "#000",
    marginBottom: 5,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  currency: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 5,
    fontFamily: "Poppins_700Bold",
    color: "#000",
  },
  amountInput: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    color: "#000",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(5, 5, 5, 0.3)",
    width: "50%",
    marginVertical: 5,
  },
  descriptionInput: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },
  placeholderText: {
    color: "#A0AEC0",
    fontStyle: "italic",
  },
});


// import React, { useState } from "react";
// import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
// import { Controller, Control } from "react-hook-form";
// import { BlurView } from "expo-blur";

// interface Props {
//   control: Control<any>;
//   label: string;
// }

// const AmountDescriptionInput: React.FC<Props> = ({ control, label }) => {
//   const [amountFocused, setAmountFocused] = useState(false);
//   const [descFocused, setDescFocused] = useState(false);

//   return (
//     <BlurView intensity={50} tint="light" style={styles.blurContainer}>
//       <View style={[styles.container, (amountFocused || descFocused) && styles.focusedContainer]}>
//         {/* Amount Section */}
//         <Text style={styles.label}>Amount</Text>
//         <View style={styles.amountWrapper}>
//           <Text style={styles.currency}>₹</Text>
//           <Controller
//             control={control}
//             name="amount"
//             defaultValue={0}
//             render={({ field: { onChange, value } }) => (
//               <TextInput
//                 style={[styles.amountInput, amountFocused && styles.inputFocused]}
//                 keyboardType="numeric"
//                 value={String(value)}
//                 onChangeText={onChange}
//                 accessibilityLabel="Amount input"
//                 accessibilityHint="Enter the amount in rupees"
//                 onFocus={() => setAmountFocused(true)}
//                 onBlur={() => setAmountFocused(false)}
//               />
//             )}
//           />
//         </View>
//         <View style={styles.separator} />

//         {/* Description Section */}
//         <Text style={styles.label}>{label}</Text>
//         <Controller
//           control={control}
//           name={label}
//           defaultValue=""
//           render={({ field: { onChange, value } }) => (
//             <TextInput
//               style={[
//                 styles.descriptionInput,
//                 descFocused && styles.inputFocused,
//                 !value && styles.placeholderText,
//               ]}
//               placeholder="Tap to add"
//               placeholderTextColor="#A0AEC0"
//               value={value}
//               onChangeText={onChange}
//               accessibilityLabel={`${label} input`}
//               accessibilityHint={`Tap to enter a ${label}`}
//               onFocus={() => setDescFocused(true)}
//               onBlur={() => setDescFocused(false)}
//             />
//           )}
//         />
//       </View>
//     </BlurView>
//   );
// };

// export default AmountDescriptionInput;

// const styles = StyleSheet.create({
//   blurContainer: {
//     borderRadius: 15,
//     overflow: "hidden",
//     width: "100%",
//     marginVertical: 10,
//   },
//   container: {
//     backgroundColor: "rgba(255,255,255,0.8)",
//     borderRadius: 15,
//     padding: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   focusedContainer: {
//     shadowOpacity: 0.4,
//     shadowRadius: 6,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     alignSelf: "flex-start",
//     marginBottom: 8,
//   },
//   amountWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     width: "100%",
//   },
//   currency: {
//     fontSize: 22,
//     fontWeight: "600",
//     marginRight: 8,
//     color: "#333",
//   },
//   amountInput: {
//     fontSize: 22,
//     fontWeight: "600",
//     color: "#333",
//     flex: 1,
//     paddingVertical: Platform.OS === "ios" ? 8 : 4,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     textAlign: "center",
//   },
//   separator: {
//     width: "100%",
//     height: 1,
//     backgroundColor: "#ccc",
//     marginVertical: 16,
//   },
//   descriptionInput: {
//     fontSize: 16,
//     color: "#333",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     width: "100%",
//     paddingVertical: Platform.OS === "ios" ? 8 : 4,
//     textAlign: "center",
//   },
//   inputFocused: {
//     borderBottomColor: "#007AFF",
//   },
//   placeholderText: {
//     fontStyle: "italic",
//     color: "#A0AEC0",
//   },
// });
