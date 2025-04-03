import api from "./api";

export type Detected = {
  _id: string;
  transaction_type: string;
  description: string;
  from_account?: string;
  to_account?: string;
  amount: number;
  created_at_date_time?: string;
  user_id?: string;
  notes?: string;
}

type GetDetectedResponse = {
  data: Detected;
}

export type GetDetectedResponses = {
  data: Detected[];
}


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
    deleteDetectedTransaction: builder.mutation({
      query: (id) => ({
        url: `/detected-transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "detectedTransaction", id },
        "detectedTransaction",
      ],
    }),
  }),
});

export const {
  useCreateDetectedTransactionMutation,
  useGetDetectedTransactionQuery,
  useDeleteDetectedTransactionMutation,
} = detectedTransactionApi;
