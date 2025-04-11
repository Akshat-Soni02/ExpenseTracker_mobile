import api from "./api";
import { GetBillsResponse } from "./billApi";
import { GetBudgetsResponse } from "./budgetApi";
import { GetDetectedResponses } from "./detectedTransactionApi";
import { ExpenseMedia, GetExpensesResponse } from "./expenseApi";
import { GetGroupsResponse } from "./groupApi";
import { GetTransactionsResponse } from "./personalTransactionApi";
import { GetSettlementsResponse } from "./settlementApi";
import { GetWalletsResponse } from "./walletApi";

export type friend = {
  _id: string;
  name: string;
  email: string;
  profile_photo: string;
  amount: number;
  type: "debit" | "credit" | undefined;
}

type oauth = {
  auth_id: string;
  auth_provider: string;
}

type borrower = {
  lender_id: string;
  amount: number;
}

type lender = {
  borrower_id: string;
  amount: number;
}

type settler = {
  user_id: string;
  amount: number;
}

export type User = {
  _id: string;
  name: string;
  phone_number?: number;
  email: string;
  profile_photo?: ExpenseMedia;
  oauth?: oauth;
  lended?: borrower[];
  borrowed?: lender[];
  settled?: settler[];
  futureFriends?: {email: string}[];
  otp?: string;
  otpExpiry?: string | Date;
  daily_limit?: number;
  password?: string;
}

type GetUserResponse = {
  data: User;
}

type GetUsersResponse = {
  data: User[];
}

type LoginUserResponse = {
  message: string;
  token: string;
  userData: User;
}

type CreateUserRequest = {
  email: string;
  password: string;
}

type UpdateUserRequest = Partial<Omit<User, "_id" | "lended" | "borrowed" | "settled" | "futureFriends" | "otp" | "otpExpiry">>;

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<LoginUserResponse, CreateUserRequest>({
      query: (body) => ({
        url: `/users/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    googleLogin: builder.mutation<LoginUserResponse, {idToken: string}>({
      query: (body) => ({
        url: `/users/auth/google`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    loginUser: builder.mutation<LoginUserResponse, {email: string, password: string}>({
      query: (body) => ({
        url: `/users/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    sendOtp: builder.mutation<void, {email: string}>({
      query: (body) => ({
        url: `/users/send-otp`,
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<void, {email: string, otp: string}>({
      query: (body) => ({
        url: `/users/verify-otp`,
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<void, {email: string, newPassword: string}>({
      query: (body) => ({
        url: `/users/reset-password`,
        method: "POST",
        body,
      }),
    }),

    // sendInvites: builder.mutation<void, {invitees: {email: string}[]}>({
    //   query: (body) => ({
    //     url: `/users/send-invites`,
    //     method: "POST",
    //     body,
    //   }),
    // }),

    getUser: builder.query<GetUserResponse, void>({
      query: () => `/users/me`,
      providesTags: ["user"],
    }),
    getUserById: builder.query<GetUserResponse, string>({
      query: (id) => `/users/${id}`,
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: `/users/logout`,
        method: "GET",
      }),
      invalidatesTags: [
        "authToken",
        "user",
        "group",
        "expense",
        "wallet",
        "settlement",
        "bill",
        "budget",
        "detectedTransaction",
        "personalTransaction",
      ],
    }),

    getUserGroups: builder.query<GetGroupsResponse, void>({
      query: () => `/users/groups`,
      providesTags: ["group"],
    }),

    getUserExpenses: builder.query<GetExpensesResponse, void>({
      query: () => `/users/expenses`,
      providesTags: ["expense"],
    }),

    getUserSettlements: builder.query<GetSettlementsResponse, {group_id?: string} | void>({
      query: (arg={}) => {
        const params = new URLSearchParams();
        if (arg && arg.group_id) params.append("group_id", arg.group_id);
        return `/users/settlements?${params.toString()}`;
      },
      providesTags: ["settlement"],
    }),

    getUserWallets: builder.query<GetWalletsResponse, void>({
      query: () => `/users/wallets`,
      providesTags: ["wallet"],
    }),

    getUserBudgets: builder.query<GetBudgetsResponse, void>({
      query: () => `/users/budgets`,
      providesTags: ["budget"],
    }),

    getUserBills: builder.query<GetBillsResponse, {status: "pending" | "missed" | "paid"}>({
      query: ({ status }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        return `/users/bills?${params.toString()}`;
      },
      providesTags: ["bill"],
    }),

    getUserPersonalTransactions: builder.query<GetTransactionsResponse, void>({
      query: () => `/users/personal-transactions`,
      providesTags: ["personalTransaction"],
    }),

    getUserDetectedTransactions: builder.query<GetDetectedResponses, void>({
      query: () => `/users/detected-transactions`,
      providesTags: ["detectedTransaction"],
    }),

    getUserFriends: builder.query<{data: friend[]},void>({
      query: () => `/users/friends`,
      providesTags: ["user"],
    }),

    getTodaysSpend: builder.query<{ data: number | null }, void>({
      query: () => `/users/todays-spend`,
      providesTags: ["user"],
    }),

    getUserCurrentExchangeStatus: builder.query<{data: {lendedAmount: number, borrowedAmount: number}}, void>({
      query: () => `/users/current-exchange-status`,
      providesTags: ["user"],
    }),

    remindUserBorrower: builder.mutation<void,{borrower_id: string}>({
      query: ({ borrower_id }) => ({
        url: `/users/remind-borrower/${borrower_id}`,
        method: "POST",
      }),
    }),

    remindUserBorrowers: builder.mutation<void,void>({
      query: () => ({
        url: `/users/remind-borrowers`,
        method: "POST",
      }),
    }),

    addUserFriends: builder.mutation<void, {invitees: {email: string}[]}>({
      query: (body) => ({
        url: `/users/send-invites`,
        method: "POST",
        body
      }),
      invalidatesTags: ["user"]
    }),

    autoaddFriends: builder.mutation<void, {email:string}>({
      query: (body) => ({
        url: `/users/auto-add-friends`,
        method: "POST",
        body
      }),
    }),

    updateUserDetails: builder.mutation<GetUserResponse, FormData>({
      query: ( body ) => ({
        url: `/users/profile-details`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    updateUserAccessToken: builder.mutation<void, {token:string}>({
      query: ( body ) => ({
        url: `/users/update-access-token`,
        method: "PUT",
        body,
      }),
    }),

    updateUserProfilePhoto: builder.mutation<GetUserResponse, UpdateUserRequest>({
      query: (body) => ({
        url: `/users/profile-photo`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useGoogleLoginMutation,
  useLoginUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useLogoutUserMutation,
  useGetUserGroupsQuery,
  useGetUserExpensesQuery,
  useGetUserBudgetsQuery,
  useGetUserBillsQuery,
  useGetUserWalletsQuery,
  useGetUserSettlementsQuery,
  useGetUserPersonalTransactionsQuery,
  useGetUserDetectedTransactionsQuery,
  useGetUserFriendsQuery,
  useLazyGetUserFriendsQuery,
  useGetUserCurrentExchangeStatusQuery,
  useRemindUserBorrowerMutation,
  useRemindUserBorrowersMutation,
  useUpdateUserDetailsMutation,
  useUpdateUserAccessTokenMutation,
  useUpdateUserProfilePhotoMutation,
  useAddUserFriendsMutation,
  useAutoaddFriendsMutation,
  useGetTodaysSpendQuery,
} = userApi;
