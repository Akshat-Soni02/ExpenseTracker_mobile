import api from "./api";

export const budgetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBudget: builder.mutation({
      query: (body) => ({
        url: `/budgets/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["budget"],
    }),

    getBudget: builder.query({
      query: (id) => `/budgets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "budget", id }],
    }),

    updateBudget: builder.mutation({
      query: ({ id, body }) => ({
        url: `/budgets/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "budget", id },
        "budget",
      ],
    }),

    deleteBudget: builder.mutation({
      query: (id) => ({
        url: `/budgets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "budget", id },
        "budget",
      ],
    }),
  }),
});

export const {
  useCreateBudgetMutation,
  useDeleteBudgetMutation,
  useUpdateBudgetMutation,
  useGetBudgetQuery,
} = budgetApi;
