import api from "./api";

export const personalTransactionApi = api.injectEndpoints({
    endpoints: (builder) => ({
      createPersonalTransaction: builder.mutation({
        query: (body) => ({
          url: `/personal-transactions/new`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["personalTransaction", "wallet"],
      }),
  
      getUserPeriodTransactions: builder.query({
        query: () => `/personal-transactions/userPeriod`,
        providesTags: ["personalTransaction"],
      }),
  
      getPersonalTransaction: builder.query({
        query: (id) => `/personal-transactions/${id}`,
        providesTags: (_result, _error, id) => [{ type: "personalTransaction", id }],
      }),
  
      updatePersonalTransaction: builder.mutation({
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
  
      deletePersonalTransaction: builder.mutation({
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
  