import api from "./api";

export const detectedTransactionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createDetectedTransaction: builder.mutation({
      query: (body) => ({
        url: `/detected-transactions/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["detectedTransaction"],
    }),

    getDetectedTransaction: builder.query({
      query: (id) => `/detected-transactions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "detectedTransaction", id }],
    }),
  }),
});

export const {
  useCreateDetectedTransactionMutation,
  useGetDetectedTransactionQuery,
} = detectedTransactionApi;
