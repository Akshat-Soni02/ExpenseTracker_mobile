import api from "./api";
import { Expense } from "./expenseApi";
import { Settlement } from "./settlementApi";

type OtherMember = {
  other_member_id: string;
  amount: number;
  exchange_status: "lended" | "borrowed" | "settled";
}

type GroupMember = {
  member_id: string;
  other_members: OtherMember[];
}

export type Group = {
  _id: string;
  group_title: string;
  initial_budget?: number;
  settle_up_date?: Date | null;
  members: Array<GroupMember>;
  creator_id?: string;
}

export type GroupExchangeDetail = {
  other_member_name: string;
  other_member_profile_photo?: string;
  amount: number;
  exchange_status: string;
  other_member_id: string;
}

type History = {
  type: "expense" | "settlement";
} & Partial<Expense> & Partial<Settlement>;

type GroupHistory = {
  data: Array<History> | [];
}

type GetGroupResponse = {
  data: Group;
}

export type GetGroupsResponse = {
  data: Group[];
}

type CreateGroupRequest = Omit<Group, "_id" | "creator_id" | "members"> & {memberIds: string[]};
type UpdateGroupRequest = Partial<CreateGroupRequest>;


export const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation<GetGroupResponse, CreateGroupRequest>({
      query: (body) => ({
        url: `/groups/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["group"],
    }),

    leaveGroup: builder.query<void, {groupId: string}>({
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

    getUserExchangeStateInGroup: builder.query<{data: GroupExchangeDetail[]}, {group_id: string}>({
      query: ({ group_id }) => `/groups/exchange-state/${group_id}`,
      providesTags: ["group"],
    }),

    remindGroupBorrower: builder.mutation<void, {group_id: string, borrower_id: string, amount: number}>({
      query: ({ group_id, borrower_id, amount }) => {
        const params = new URLSearchParams();
        if (borrower_id) params.append("borrower_id", borrower_id);
        if (amount) params.append("amount", amount.toString());
        return {
          url: `/groups/remind-group-borrower/${group_id}?${params.toString()}`,
          method: "POST",
        };
      },
    }),

    remindAllGroupBorrowers: builder.mutation<void, {group_id: string}>({
      query: ({ group_id }) => ({
        url: `/groups/remind-all-group-borrowers/${group_id}`,
        method: "POST",
      }),
    }),

    getGroupHistory: builder.query<GroupHistory, string>({
      query: (group_id) => `/groups/history/${group_id}`,
      providesTags: ["group"],
    }),

    getGroup: builder.query<GetGroupResponse, string>({
      query: (id) => `/groups/${id}`,
      providesTags: ["group"],
    }),

    updateGroup: builder.mutation<GetGroupResponse, {id: string, body: UpdateGroupRequest}>({
      query: ({ id, body }) => ({
        url: `/groups/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["group"],
    }),

    deleteGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["group"],
    }),

    simplifyDebts: builder.mutation<void, string>({
      query: (id) => ({
        url: `/groups/simplify-debt/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["group","user"],
    }),

    addPeopleInGroup: builder.mutation<GetGroupResponse, {id: string, body: {newMemberIds: string[]}}>({
      query: ({ id, body }) => ({
        url: `/groups/add-to-group/${id}`,
        method: "PUT",
        body,
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
  useAddPeopleInGroupMutation
} = groupApi;
