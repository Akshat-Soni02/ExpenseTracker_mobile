declare module '@maniac-tech/react-native-expo-read-sms' {
    export function requestReadSMSPermission(): Promise<boolean>;
  
    export function startReadSMS(
      successCallback: (
        status: string,
        sms: string,
        error: string
      ) => void,
      failureCallback: (
        status: string,
        sms: string,
        error: string
      ) => void
    ): void;
  }
  