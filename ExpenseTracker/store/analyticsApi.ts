import api from "./api";

export type MonthlySpend = {
  amount: number;
  month: string;
};

export type CategoricalSpend = {
  amount: number;
  category: string;
};

export type GetMonthlySpendResponse = {
  data: MonthlySpend[];
};


export type GetCategoricalSpendResponse = {
  data: CategoricalSpend[];
};

export const analyticsApi = api.injectEndpoints({
    endpoints: (builder) => ({ 
        getMonthlySpend: builder.query<GetMonthlySpendResponse, void>({
            query: () => `/analytics/monthly-spending`,
            providesTags: (_result, _error) => [{ type: "analytics" }],
          }),
        getCategoricalSpend: builder.query<GetCategoricalSpendResponse, void>({
            query: () => `/analytics/categorical-spending`,
            providesTags: (_result, _error) => [{ type: "analytics" }],
          }),
    }),
});


export const {
  useGetMonthlySpendQuery,
  useGetCategoricalSpendQuery
} = analyticsApi;