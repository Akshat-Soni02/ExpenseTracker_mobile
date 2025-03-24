import api from "./api";

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createExpense: builder.mutation({
      query: (body) => ({
        url: `/expenses/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["expense", "group", "wallet","user"],
    }),

    // Get expenses for a user based on a period (e.g., daily, weekly, monthly)
    getUserPeriodExpenses: builder.query({
        query: ({ startDate, endDate }) => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            return `/expenses/user/period?${params.toString()}`;
        },
        providesTags: ["expense"],
    }),
    getCustomExpenses: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/expenses/custom?${queryString}`;
      },
      providesTags: ["expense"],
    }),
    getExpense: builder.query({
      query: (id) => `/expenses/${id}`,
      providesTags: ["expense"],
    }),
    updateExpense: builder.mutation({
      query: ({ expense_id, body }) => ({
        url: `/expenses/${expense_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["expense", "group", "wallet", "user"],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expense", "group", "wallet", "user"],
    }),
  }),
});

export const {
  useCreateExpenseMutation,
  useGetUserPeriodExpensesQuery,
  useGetCustomExpensesQuery,
  useGetExpenseQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
