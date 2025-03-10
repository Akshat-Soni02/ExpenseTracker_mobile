import api from "./api";

export const billApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBill: builder.mutation({
      query: (body) => ({
        url: `/bills/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["bill"],
    }),

    updateUserStatusOfBill: builder.mutation({
      query: ({ body, billId }) => ({
        url: `/bills/bill-status-update/${billId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { billId }) => [{ type: "bill", id: billId }],
    }),

    getBill: builder.query({
      query: (id) => `/bills/${id}`,
      providesTags: (_result, _error, id) => [{ type: "bill", id }],
    }),

    updateBill: builder.mutation({
      query: ({ id, body }) => ({
        url: `/bills/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "bill", id }],
    }),

    deleteBill: builder.mutation({
      query: (id) => ({
        url: `/bills/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "bill", id }],
    }),
  }),
});

export const {
  useCreateBillMutation,
  useDeleteBillMutation,
  useGetBillQuery,
  useUpdateBillMutation,
  useUpdateUserStatusOfBillMutation,
} = billApi;