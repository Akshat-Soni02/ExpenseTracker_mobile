import api from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: `/user/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    googleLogin: builder.mutation({
      query: (body) => ({
        url: `/users/auth/google`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    loginUser: builder.mutation({
      query: (body) => ({
        url: `/users/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    sendOtp: builder.mutation({
      query: (body) => ({
        url: `/users/send-otp`,
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (body) => ({
        url: `/users/verify-otp`,
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: `/users/reset-password`,
        method: "POST",
        body,
      }),
    }),

    sendInvites: builder.mutation({
      query: (body) => ({
        url: `/users/send-invites`,
        method: "POST",
        body,
      }),
    }),

    getUser: builder.query<void, void>({
      query: () => `/users/me`,
      providesTags: ["user"],
    }),
    getUserById: builder.query({
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

    getUserGroups: builder.query({
      query: () => `/users/groups`,
      providesTags: ["group"],
    }),

    getUserExpenses: builder.query({
      query: () => `/users/expenses`,
      providesTags: ["expense"],
    }),

    getUserSettlements: builder.query({
      query: ({ group_id }) => {
        const params = new URLSearchParams();
        if (group_id) params.append("group_id", group_id);
        return `/users/settlements?${params.toString()}`;
      },
      providesTags: ["settlement"],
    }),

    getUserWallets: builder.query<void, void>({
      query: () => `/users/wallets`,
      providesTags: ["wallet"],
    }),

    getUserBudgets: builder.query({
      query: () => `/users/budgets`,
      providesTags: ["budget"],
    }),

    getUserBills: builder.query({
      query: ({ status }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        return `/users/bills?${params.toString()}`;
      },
      providesTags: ["bill"],
    }),

    getUserPersonalTransactions: builder.query({
      query: () => `/users/personal-transactions`,
      providesTags: ["personalTransaction"],
    }),

    getUserDetectedTransactions: builder.query({
      query: () => `/users/detected-transactions`,
      providesTags: ["detectedTransaction"],
    }),

    getUserFriends: builder.query<void,void>({
      query: () => `/users/friends`,
      providesTags: ["user"],
    }),

    getUserCurrentExchangeStatus: builder.query<void, void>({
      query: () => `/users/current-exchange-status`,
      providesTags: ["user"],
    }),

    remindUserBorrower: builder.mutation({
      query: ({ borrower_id }) => ({
        url: `/users/remind-borrower/${borrower_id}`,
        method: "POST",
      }),
    }),

    remindUserBorrowers: builder.mutation({
      query: () => ({
        url: `/users/remind-borrowers`,
        method: "POST",
      }),
    }),

    updateUserDetails: builder.mutation({
      query: ( body ) => ({
        url: `/users/profile-details`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    updateUserProfilePhoto: builder.mutation({
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
  useSendInvitesMutation,
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
  useGetUserCurrentExchangeStatusQuery,
  useRemindUserBorrowerMutation,
  useRemindUserBorrowersMutation,
  useUpdateUserDetailsMutation,
  useUpdateUserProfilePhotoMutation,
} = userApi;
