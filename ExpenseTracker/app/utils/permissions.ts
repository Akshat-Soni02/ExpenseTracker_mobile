import { Permission, PermissionsAndroid, Platform } from 'react-native';

export const requestAndroidPermission = async (permission: Permission) => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return false;
};

export const hasAndroidPermission = async (permission: Permission) => {
    if(Platform.OS === 'android') {
        return PermissionsAndroid.check(permission);
    }
    return false;
}