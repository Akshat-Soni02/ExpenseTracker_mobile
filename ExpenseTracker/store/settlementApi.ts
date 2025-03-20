import api from "./api";

export const settlementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSettlement: builder.mutation({
      query: (body) => ({
        url: `/settlements/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["settlement", "group", "wallet"],
    }),

    getSettlement: builder.query({
      query: (id) => `/settlements/${id}`,
      providesTags: (_result, _error, id) => [{ type: "settlement", id }],
    }),

    updateSettlement: builder.mutation({
      query: ({ id, body }) => ({
        url: `/settlements/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "settlement", id },
        "settlement", "group", "wallet"
      ],
    }),

    deleteSettlement: builder.mutation({
      query: (id) => ({
        url: `/settlements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "settlement", id },
        "settlement", "group", "wallet"
      ],
    }),
  }),
});

export const {
  useCreateSettlementMutation,
  useDeleteSettlementMutation,
  useGetSettlementQuery,
  useUpdateSettlementMutation
} = settlementApi;
