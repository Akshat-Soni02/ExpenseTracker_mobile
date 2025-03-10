import api from "./api";

export const settlementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSettlement: builder.mutation({
      query: (body) => ({
        url: `/settlements/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["settlement"],
    }),

    getSettlement: builder.query({
      query: (id) => `/settlements/${id}`,
      providesTags: (_result, _error, id) => [{ type: "settlement", id }],
    }),

    updateSettlement: builder.mutation({
      query: ({ id, body }) => ({
        url: `/settlements/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "settlement", id },
        "settlement",
      ],
    }),

    deleteSettlement: builder.mutation({
      query: (id) => ({
        url: `/settlements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "settlement", id },
        "settlement",
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
