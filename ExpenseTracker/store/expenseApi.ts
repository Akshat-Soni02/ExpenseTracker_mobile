import api from "./api";

type ExpenseUser = {
  user_id: string;
  amount: number;
}

export type ExpenseMedia = {
  url: string;
  public_id: string;
}

export type Expense = {
  _id: string;
  description: string;
  lenders: Array<ExpenseUser>;
  borrowers: Array<ExpenseUser>;
  group_id?: string;
  wallet_id?: string;
  media?: ExpenseMedia;
  total_amount: number;
  expense_category?: string;
  created_at_date_time: string;
  creator?: {
    creator_id: string;
    amount: number;
  };
  notes?: string;
}

type GetExpenseResponse = {
  data: Expense;
}

export type GetExpensesResponse = {
  data: Expense[];
}

type CreateExpenseRequest = Omit<Expense, "_id" | "creator">;
type UpdateExpenseRequest = Partial<CreateExpenseRequest>;

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createExpense: builder.mutation<GetExpenseResponse, FormData>({
      query: (body) => ({
        url: `/expenses/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["expense", "group", "wallet","user"],
    }),

    getUserPeriodExpenses: builder.query<GetExpensesResponse, {startDate: string, endDate: string}>({
        query: ({ startDate, endDate }) => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            return `/expenses/user/period?${params.toString()}`;
        },
        providesTags: ["expense"],
    }),
    getCustomExpenses: builder.query<GetExpensesResponse, any>({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/expenses/custom?${queryString}`;
      },
      providesTags: ["expense"],
    }),
    getExpense: builder.query<GetExpenseResponse, string>({
      query: (id) => `/expenses/${id}`,
      providesTags: ["expense"],
    }),
    updateExpense: builder.mutation<GetExpenseResponse, {expense_id: string, body: FormData}>({
      query: ({ expense_id, body }) => ({
        url: `/expenses/${expense_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["expense", "group", "wallet", "user"],
    }),
    deleteExpense: builder.mutation<void, string>({
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
