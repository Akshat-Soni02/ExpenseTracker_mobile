import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Snackbar } from 'react-native-paper';

interface SnackbarProps {
    visible: boolean;
    onDismiss: any;
    message?: string;
    action?: any;
}

const CustomSnackBar: React.FC<SnackbarProps> = ({visible, onDismiss, message, action}) => {

    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={2500}
            style={{ backgroundColor: '#1d3346', alignSelf: "center" }}
            action={action}>
            <Text style={{ color: "white" }}>{message}</Text>
        </Snackbar>
    );
};

export default CustomSnackBar;