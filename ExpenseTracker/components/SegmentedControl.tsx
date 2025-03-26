// import React, { useState } from "react";
// import { View, StyleSheet } from "react-native";
// import { TouchableOpacity, Text, Animated } from "react-native";

// const SegmentedControl = ({ value, onChange, isBill }) => {

//   if(isBill) {
//     const options = ["Pending", "Completed", "Missed"];
  
//     return (
//       <View style={styles.container}>
//         {options.map((option, index) => {
//           const isSelected = value === option.toLowerCase();
  
//           return (
//             <TouchableOpacity
//               key={option}
//               style={[
//                 styles.button,
//                 isSelected && styles.selectedButton,
//                 index === 0 && styles.firstButton,
//                 index === options.length - 1 && styles.lastButton,
//               ]}
//               onPress={() => onChange(option.toLowerCase())}
//             >
//               <Text style={[styles.text, isSelected && styles.selectedText]}>
//                 {option}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     );
//   }
//   const options = ["Splits", "Spends", "Settlements"];
  
//   return (
//     <View style={styles.container}>
//       {options.map((option, index) => {
//         const isSelected = value === option.toLowerCase();

//         return (
//           <TouchableOpacity
//             key={option}
//             style={[
//               styles.button,
//               isSelected && styles.selectedButton,
//               index === 0 && styles.firstButton,
//               index === options.length - 1 && styles.lastButton,
//             ]}
//             onPress={() => onChange(option.toLowerCase())}
//           >
//             <Text style={[styles.text, isSelected && styles.selectedText]}>
//               {option}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// export default function App({value, setValue, isBill}) {
//   // const [value, setValue] = useState("splits");

//   return (
//     <View style={styles.wrapper}>
//       <SegmentedControl value={value} onChange={setValue} isBill={isBill}/>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   container: {
//     flexDirection: "row",
//     backgroundColor: "#e6eefc",
//     borderRadius: 25,
//     padding: 3,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     alignItems: "center",
//     borderRadius: 20,
//   },
//   selectedButton: {
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   firstButton: {
//     borderTopLeftRadius: 25,
//     borderBottomLeftRadius: 25,
//   },
//   lastButton: {
//     borderTopRightRadius: 25,
//     borderBottomRightRadius: 25,
//   },
//   text: {
//     color: "#4A627A",
//     fontWeight: "500",
//     fontSize: 14
//   },
//   selectedText: {
//     fontWeight: "semibold",
//     color: "#000",
//   },
// });

import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SegmentedControl = ({ value, onChange, isBill }) => {
  const options = isBill ? ["Pending", "Completed", "Missed"] : ["Splits", "Spends", "Settlements"];
  
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = value === option.toLowerCase();

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              isSelected && styles.selectedButton,
              index === 0 && styles.firstButton,
              index === options.length - 1 && styles.lastButton,
            ]}
            onPress={() => onChange(option.toLowerCase())}
            activeOpacity={0.8} // Reduce opacity effect on press
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function App({ value, setValue, isBill }) {
  return (
    <View style={styles.wrapper}>
      <SegmentedControl value={value} onChange={setValue} isBill={isBill} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#e6eefc",
    borderRadius: screenWidth * 0.05,
    padding: screenWidth * 0.01,
    width: screenWidth * 0.9, // 90% of the screen width
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
  },
  button: {
    width: "33%",
    paddingVertical: screenHeight * 0.015,
    alignItems: "center",
    borderRadius: screenWidth * 0.04,
  },
  selectedButton: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  firstButton: {
    borderTopLeftRadius: screenWidth * 0.05,
    borderBottomLeftRadius: screenWidth * 0.05,
  },
  lastButton: {
    borderTopRightRadius: screenWidth * 0.05,
    borderBottomRightRadius: screenWidth * 0.05,
  },
  text: {
    color: "#4A627A",
    fontWeight: "500",
    fontSize: screenWidth * 0.035,
  },
  selectedText: {
    fontWeight: "600",
    color: "#000",
  },
});
