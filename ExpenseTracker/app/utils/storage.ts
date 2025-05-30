import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getItem = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeItem = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
