import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.193.125:3001/api/v1',
    credentials: 'include',
    prepareHeaders: async (headers) => {
      const authToken = await AsyncStorage.getItem("authToken");
      console.log("Hlllllll",authToken);
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['authToken','user', 'group', 'expense', 'wallet', "settlement", "bill", "budget", "detectedTransaction", "personalTransaction"],
  endpoints: () => ({}),
});

export default api;