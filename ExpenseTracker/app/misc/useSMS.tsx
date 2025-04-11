import { useEffect, useState } from "react";
import { PermissionsAndroid } from "react-native";
import {
    requestReadSMSPermission,
    startReadSMS,
} from "@maniac-tech/react-native-expo-read-sms";

const useSMS = () => {
  const [successCallbackStatus, setSuccessCallbackStatus] = useState<string | null>(null);
  const [errorCallbackStatus, setErrorCallbackStatus] = useState<string | null>(null);
  const [smsMessageData, setSmsMessageData] = useState<string | null>(null);
  const [smsMessageNumber, setSmsMessageNumber] = useState<string | null>(null);
  const [smsMessageBody, setSmsMessageBody] = useState<string | null>(null);
  const [smsError, setSMSError] = useState<string | null>(null);

  const startReadCycle = () => {
    startReadSMS(callbackFn1, callbackFn2);
  };

  const callbackFn1 = (status: string, sms: string, error: string) => {
    if (status === "Start Read SMS successfully" || status === "success") {
      setSuccessCallbackStatus("Read SMS successfully");
      setSmsMessageData(sms);
      startReadSMS(callbackFn1, callbackFn2);
    } else {
      setSuccessCallbackStatus("Error in success callback");
      setSMSError(error);
    }
  };

  const callbackFn2 = (status: string, sms: string , error: string) => {
    setErrorCallbackStatus("Start Read SMS failed");
    setSMSError(error);
  };

  const checkPermissions = async () => {
    const customHasReceiveSMSPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
    );
    const customHasReadSMSPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS
    );
    const read = customHasReadSMSPermission;
    const receive = customHasReceiveSMSPermission;
    return read && receive;
  };

  useEffect(() => {
    const tempArray = smsMessageData?.substring("1", smsMessageData.length - 1).split(",");

    if (smsMessageData && tempArray && tempArray.length > 1) {
      const messageOriginatingAdd = tempArray[0];
      const messageBody = tempArray[1];

      setSmsMessageBody(messageBody);
      setSmsMessageNumber(messageOriginatingAdd);
    } else {
      setSmsMessageBody(null);
      setSmsMessageNumber(null);
    }
  }, [smsMessageData]);


  return {
    checkPermissions,
    errorCallbackStatus,
    requestReadSMSPermission,
    successCallbackStatus,
    smsMessageBody,
    smsMessageNumber,
    smsError,
    startReadCycle
  };
};

export default useSMS;