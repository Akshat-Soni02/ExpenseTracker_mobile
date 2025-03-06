import api from "./api";

export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createWallet: builder.mutation({
      query: (body) => ({
        url: `/wallets/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["wallet"],
    }),

    getWallet: builder.query({
      query: (id) => `/wallets/${id}`,
      providesTags: ["wallet"],
    }),

    transferWalletAmount: builder.mutation({
      query: (body) => ({
        url: `/wallets/transfer`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["wallet"],
    }),

    updateWallet: builder.mutation({
      query: ({ id, body }) => ({
        url: `/wallets/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["wallet"],
    }),

    deleteWallet: builder.mutation({
      query: (id) => ({
        url: `/wallets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["wallet"],
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useGetWalletQuery,
  useTransferWalletAmountMutation,
  useUpdateWalletMutation,
  useDeleteWalletMutation,
} = walletApi;
