import api from "./api";

export type Member = {
  user_id: string;
  amount: number;
  wallet_id?: string;
  status: "paid" | "pending";
};

export type Bill = {
  _id: string;
  bill_number: number;
  bill_title: string;
  amount: number;
  bill_category?: string;
  due_date_time: string | Date;
  final_pay_date?: string;
  recurring?: boolean;
  status: "pending" | "missed" | "paid";
  creator_id?: string;
  members?: Member[];
};

type GetBillResponse = {
  data: Bill;
};

export type GetBillsResponse = {
  data: Bill[];
};

type CreateBillRequest = Omit<Bill, "_id" | "bill_number" | "status" | "creator_id">;
type updateBillRequest = Partial<Omit<Bill, "_id" | "bill_number" | "status" | "creator_id">>;



export const billApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBill: builder.mutation<GetBillResponse, CreateBillRequest>({
      query: (body) => ({
        url: `/bills/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["bill"],
    }),

    updateUserStatusOfBill: builder.mutation<GetBillResponse, {body: {status: string}, billId: string}>({
      query: ({ body, billId }) => ({
        url: `/bills/bill-status-update/${billId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["bill"],
    }),

    getBill: builder.query<GetBillResponse, string>({
      query: (id) => `/bills/${id}`,
      providesTags: (_result, _error, id) => [{ type: "bill", id }],
    }),

    updateBill: builder.mutation<GetBillResponse, {id: string, body:updateBillRequest}>({
      query: ({ id, body }) => ({
        url: `/bills/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "bill", id }],
    }),

    deleteBill: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bills/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["bill"],
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