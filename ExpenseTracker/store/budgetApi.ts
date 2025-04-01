import api from "./api";

export type Budget = {
  _id: string;
  budget_title: string;
  amount: number;
  current_spend: number;
  budget_category?: string;
  period?: string;
  user_id?: string;
}

type GetBudgetResponse = {
  data: Budget;
}

export type GetBudgetsResponse = {
  data: Budget[];
}

type CreateBudgetRequest = Omit<Budget,"_id" | "current_spend" | "user_id">;
type UpdateBudgetRequest = Partial<CreateBudgetRequest>;

export const budgetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBudget: builder.mutation<GetBudgetResponse, CreateBudgetRequest>({
      query: (body) => ({
        url: `/budgets/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["budget"],
    }),

    getBudget: builder.query<GetBudgetResponse, string>({
      query: (id) => `/budgets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "budget", id }],
    }),

    updateBudget: builder.mutation<GetBudgetResponse, {id: string, body: UpdateBudgetRequest}>({
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

    deleteBudget: builder.mutation<void, string>({
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
