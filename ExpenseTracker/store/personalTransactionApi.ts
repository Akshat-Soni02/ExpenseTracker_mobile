import api from "./api";
import { ExpenseMedia } from "./expenseApi";

export type Transaction = {
  _id: string;
  transaction_type: "expense" | "income";
  wallet_id?: string;
  media?: ExpenseMedia;
  transaction_category?: string;
  created_at_date_time?: string;
  notes?: string;
  amount: number;
  budget_id?: string;
  user_id?: string;
}

type GetTransactionResponse = {
  data: Transaction;
}

export type GetTransactionsResponse = {
  data: Array<Transaction>;
}

type CreateTransactionRequest = Omit<Transaction, "_id" | "budget_id" | "user_id">;
type UpdateTransactionRequest = Partial<CreateTransactionRequest>;

export const personalTransactionApi = api.injectEndpoints({
    endpoints: (builder) => ({
      createPersonalTransaction: builder.mutation<GetTransactionResponse,CreateTransactionRequest>({
        query: (body) => ({
          url: `/personal-transactions/new`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["personalTransaction", "wallet"],
      }),
  
      getUserPeriodTransactions: builder.query<void, void>({
        query: () => `/personal-transactions/userPeriod`,
        providesTags: ["personalTransaction"],
      }),
  
      getPersonalTransaction: builder.query<GetTransactionResponse, string>({
        query: (id) => `/personal-transactions/${id}`,
        providesTags: (_result, _error, id) => [{ type: "personalTransaction", id }],
      }),
  
      updatePersonalTransaction: builder.mutation<GetTransactionResponse, {id: string, body: UpdateTransactionRequest}>({
        query: ({ id, body }) => ({
          url: `/personal-transactions/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "personalTransaction", id },
          "personalTransaction", "wallet"
        ],
      }),
  
      deletePersonalTransaction: builder.mutation<void, string>({
        query: (id) => ({
          url: `/personal-transactions/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, id) => [
          { type: "personalTransaction", id },
          "personalTransaction", "wallet"
        ],
      }),
    }),
  });
  
  export const {
    useCreatePersonalTransactionMutation,
    useGetUserPeriodTransactionsQuery,
    useGetPersonalTransactionQuery,
    useUpdatePersonalTransactionMutation,
    useDeletePersonalTransactionMutation,
  } = personalTransactionApi;
  