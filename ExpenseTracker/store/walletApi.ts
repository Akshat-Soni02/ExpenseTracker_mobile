import { Update } from "@reduxjs/toolkit";
import api from "./api";

type Wallet = {
  _id: string;
  amount: number;
  wallet_title: string;
  lower_limit?: number;
  creator_id?: string;
  deleted?: boolean;
}

type GetWalletResponse = {
  data: Wallet;
}

export type GetWalletsResponse = {
  data: Wallet[];
}

type CreateWalletRequest = Omit<Wallet, "_id" | "deleted" | "creator_id">;
type UpdateWalletRequest = Partial<CreateWalletRequest>;

export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createWallet: builder.mutation<GetWalletResponse, CreateWalletRequest>({
      query: (body) => ({
        url: `/wallets/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["wallet"],
    }),

    getWallet: builder.query<GetWalletResponse, string>({
      query: (id) => `/wallets/${id}`,
      providesTags: ["wallet"],
    }),

    //this has to be updated later
    transferWalletAmount: builder.mutation<void, void>({
      query: (body) => ({
        url: `/wallets/transfer`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["wallet"],
    }),

    updateWallet: builder.mutation<GetWalletResponse, {id: string, body: UpdateWalletRequest}>({
      query: ({ id, body }) => ({
        url: `/wallets/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["wallet"],
    }),

    deleteWallet: builder.mutation<void, string>({
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
  useLazyGetWalletQuery,
  useTransferWalletAmountMutation,
  useUpdateWalletMutation,
  useDeleteWalletMutation,
} = walletApi;
