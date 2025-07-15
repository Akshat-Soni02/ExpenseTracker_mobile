// import React, { useEffect, useState } from 'react';
// import { OTPWidget } from '@msg91comm/sendotp-react-native';
// import { TextInput, TouchableOpacity, View, StyleSheet, Text, Alert } from 'react-native';


// const widgetId = "35676b666963373539323436";
// const tokenAuth = "459774T79Mx5n7pf4R6870b007P1";

// const App = () => {
//     useEffect(() => {
//         OTPWidget.initializeWidget(widgetId, tokenAuth);
//     }, [])

//     const [number, setNumber] = useState('');
//     const [otp, setOtp] = useState('');
//     const [reqId, setReqId] = useState('');
//     const [mode, setMode] = useState<"SEND" | "VERIFY">("SEND");

//     const handleSendOtp = async () => {
//         const data = {
//             identifier: '919649603978'
//         }
//         const response = await OTPWidget.sendOTP(data);
//         if(response.type === 'success') {
//             Alert.alert("OTP SENT");
//             setReqId(response.message);
//             setMode("VERIFY");
//         } else Alert.alert('OTP NOT SENT');
//         console.log(response);  
//     }


//     const handleVerifyOtp = async () => {
//         const body = {
//             reqId,
//             otp
//         }
//         const response = await OTPWidget.verifyOTP(body);
//         console.log(response);
//     }

//     return (
//         <View>
//             {mode === "SEND" ? (
//                 <>
//                 <TextInput
//                     placeholder='Number'
//                     value={number}
//                     keyboardType='numeric'
//                     style={{ backgroundColor: '#ededed', margin: 10 }}
//                     onChangeText={(text) => {
//                         setNumber(text)
//                     }}
//                 />
//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={()=>{
//                         handleSendOtp()
//                     }}
//                 >
//                     <Text>
//                         Send OTP
//                     </Text>
//                 </TouchableOpacity>
//                 </>
//             ) : (
//                 <>
//                 <TextInput
//                     placeholder='Otp'
//                     value={otp}
//                     keyboardType='numeric'
//                     style={{ backgroundColor: '#ededed', margin: 10 }}
//                     onChangeText={(text) => {
//                         setOtp(text)
//                     }}
//                 />
//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={()=>{
//                         handleVerifyOtp()
//                     }}
//                 >
//                     <Text>
//                         Verify OTP
//                     </Text>
//                 </TouchableOpacity>
//                 </>
//             )}
//         </View>
//     );
// }
    
// export default App;

// const styles = StyleSheet.create({
//     button: {
//         width: 100,
//         height: 100
//     }
// })