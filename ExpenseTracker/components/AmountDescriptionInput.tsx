// import React from "react";
// import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
// import { Controller, Control } from "react-hook-form";
// import { BlurView } from "expo-blur";

// interface Props {
//   control: Control<any>;
//   label: string;
//   update? : boolean;
// }

// const AmountDescriptionInput: React.FC<Props> = ({ control, label, update }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Amount</Text>
//       <View style={styles.amountWrapper}>
//         <Text style={styles.currency}>₹</Text>
//         <Controller
//           control={control}
//           name="amount"
//           defaultValue={0} // Default to a number
//           render={({ field: { onChange, value } }) => (
//             <TextInput
//               style={styles.amountInput}
//               keyboardType="numeric"
//               value={value ? String(value) : "0"} // Ensure input is always displayed as a string
//               placeholder="0"
//               onChangeText={(text) => {
//                 const numericValue = parseFloat(text) || 0; // Convert to number, default to 0 if empty
//                 onChange(numericValue);
//               }}
//               accessibilityLabel="Amount input"
//               accessibilityHint="Enter the amount in rupees"
//             />
//           )}
//         />
//       </View>
//       <View style={styles.separator} />

//       {/* Description Section */}
//       <Text style={styles.label}>{label}</Text>
//       <Controller
//         control={control}
//         name={label}
//         defaultValue=""
//         render={({ field: { onChange, value } }) => (
//           <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
//             <TextInput
//               style={[styles.descriptionInput, !value && styles.placeholderText]}
//               placeholder="Tap to add"
//               placeholderTextColor="#A0AEC0"
//               value={value}
//               onChangeText={onChange}
//               accessibilityLabel={`${label} input`}
//               accessibilityHint={`Tap to enter a ${label}`}
//             />
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default AmountDescriptionInput;

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 2,
//     borderColor: "rgba(255, 255, 255, 0.2)", 
//     backgroundColor: "rgba(200, 230, 255, 0.4)",
//     // rgba(200, 230, 255, 0.4)
//     borderRadius: 15,
//     padding: 20,
//     alignItems: "center",
//     width: "100%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     overflow: "hidden",
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: "bold",
//     fontFamily: "Poppins_700Bold",
//     color: "#000",
//     marginBottom: 5,
//   },
//   amountWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   currency: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginRight: 5,
//     fontFamily: "Poppins_700Bold",
//     color: "#000",
//   },
//   amountInput: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     fontFamily: "Poppins_700Bold",
//     color: "#000",
//   },
//   separator: {
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(5, 5, 5, 0.3)",
//     width: "50%",
//     marginVertical: 5,
//   },
//   descriptionInput: {
//     fontSize: 16,
//     textAlign: "center",
//     fontFamily: "Poppins_400Regular",
//     color: "#000",
//   },
//   placeholderText: {
//     color: "#A0AEC0",
//     fontStyle: "italic",
//   },
// });


import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Controller, Control } from "react-hook-form";

interface Props {
  control: Control<any>;
  label: string;
  update?: boolean;
}

const AmountDescriptionInput: React.FC<Props> = ({ control, label, update }) => {
  return (
    <View style={styles.container}>
      {/* Amount Section */}
      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountWrapper}>
        <Text style={styles.currency}>₹</Text>
        <Controller
          control={control}
          name="amount"
          defaultValue={0}
          render={({ field: { onChange, value } }) => {
            const displayValue = useMemo(() => (value ? String(value) : ""), [value]);

            return (
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={displayValue}
                placeholder="0"
                onChangeText={(text) => {
                  if (text === "") {
                    onChange("");
                    return;
                  }
                  const numericValue = parseFloat(text);
                  if (!isNaN(numericValue)) {
                    onChange(numericValue);
                  }
                }}
                accessibilityLabel="Amount input"
                accessibilityHint="Enter the amount in rupees"
              />
            );
          }}
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
          <TouchableOpacity activeOpacity={0.8}>
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
    borderRadius: 12,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  // rgba(240, 240, 240, 0.6)
  // rgba(200, 230, 255, 0.4)
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 5,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  currency: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginRight: 5,
  },
  amountInput: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
    color: "#333",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    width: "80%",
    alignSelf: "center",
    marginVertical: 8,
  },
  descriptionInput: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
  },
  placeholderText: {
    color: "#A0AEC0",
    fontStyle: "italic",
  },
});
