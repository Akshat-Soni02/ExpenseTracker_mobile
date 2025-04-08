import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  let token = await AsyncStorage.getItem("AuthToken");

  // Create a base query instance
  const rawBaseQuery = fetchBaseQuery({
    // baseUrl: 'https://expenseease-3rcx.onrender.com/api/v1',
    baseUrl : "http://192.168.193.125:3001/api/v1",
    credentials: 'include',
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await rawBaseQuery(args, api, extraOptions);

  // If token was missing, wait and retry once
  if (!token && result.error?.status === 401) {
    console.log("Token was missing, retrying...");
    await new Promise((res) => setTimeout(res, 500)); // Small delay before retry
    token = await AsyncStorage.getItem("AuthToken");
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['authToken', 'user', 'group', 'expense', 'wallet', "settlement", "bill", "budget", "detectedTransaction", "personalTransaction"],
  endpoints: () => ({}),
});

export default api;