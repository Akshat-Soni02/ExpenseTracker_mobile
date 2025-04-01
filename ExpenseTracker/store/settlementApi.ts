import api from "./api";

export type Settlement = {
  _id: string;
  settlement_description: string;
  payer_wallet_id?: string;
  payer_id: string;
  receiver_wallet_id?: string;
  receiver_id: string;
  amount: number;
  group_id?: string;
}

type GetSettlementResponse = {
  data: Settlement;
}

export type GetSettlementsResponse = {
  data: Settlement[];
}

type CreateSettlementRequest = Omit<Settlement, "_id">;
type updateSettlementRequest = Partial<CreateSettlementRequest>;

export const settlementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSettlement: builder.mutation<GetSettlementResponse, CreateSettlementRequest>({
      query: (body) => ({
        url: `/settlements/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["settlement", "group", "wallet","user"],
    }),

    getSettlement: builder.query<GetSettlementResponse, string>({
      query: (id) => `/settlements/${id}`,
      providesTags: (_result, _error, id) => [{ type: "settlement", id }],
    }),

    updateSettlement: builder.mutation<GetSettlementResponse, {id: string, body: updateSettlementRequest}>({
      query: ({ id, body }) => ({
        url: `/settlements/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "settlement", id },
        "settlement", "group", "wallet", "user"
      ],
    }),

    deleteSettlement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/settlements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "settlement", id },
        "settlement", "group", "wallet", "user"
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
