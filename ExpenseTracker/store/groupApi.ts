import api from "./api";

export const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (body) => ({
        url: `/groups/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["group"],
    }),

    leaveGroup: builder.query({
      query: ({ groupId }) => `/groups/leave/${groupId}`,
      providesTags: ["group"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            api.util.invalidateTags(["group", "expense", "settlement"])
          );
        } catch (error) {
          console.error("Failed to leave group:", error);
        }
      },
    }),

    getUserExchangeStateInGroup: builder.query({
      query: ({ group_id }) => `/groups/exchange-state/${group_id}`,
      providesTags: ["group"],
    }),

    remindGroupBorrower: builder.mutation({
      query: ({ group_id, borrower_id, amount }) => {
        const params = new URLSearchParams();
        if (borrower_id) params.append("borrower_id", borrower_id);
        if (amount) params.append("amount", amount);
        return {
          url: `/groups/remind-group-borrower/${group_id}?${params.toString()}`,
          method: "POST",
        };
      },
    }),

    remindAllGroupBorrowers: builder.mutation({
      query: ({ group_id }) => ({
        url: `/groups/remind-all-group-borrowers/${group_id}`,
        method: "POST",
      }),
    }),

    getGroupHistory: builder.query({
      query: (group_id) => `/groups/history/${group_id}`,
      providesTags: ["group"],
    }),

    getGroup: builder.query({
      query: (id) => `/groups/${id}`,
      providesTags: ["group"],
    }),

    updateGroup: builder.mutation({
      query: ({ id, body }) => ({
        url: `/groups/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["group"],
    }),

    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `/groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["group"],
    }),

    simplifyDebts: builder.mutation({
      query: (id) => ({
        url: `/groups/simplify-debt/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["group"],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useLeaveGroupQuery,
  useLazyLeaveGroupQuery,
  useGetUserExchangeStateInGroupQuery,
  useRemindGroupBorrowerMutation,
  useRemindAllGroupBorrowersMutation,
  useGetGroupHistoryQuery,
  useGetGroupQuery,
  useLazyGetGroupQuery,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useSimplifyDebtsMutation,
} = groupApi;
