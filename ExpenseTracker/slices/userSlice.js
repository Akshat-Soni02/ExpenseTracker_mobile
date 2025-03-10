// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [], // User data array
    selectedUsers: [], // Selected user IDs array
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    selectUser: (state, action) => {
      state.selectedUsers.push(action.payload);
    },
    deselectUser: (state, action) => {
      state.selectedUsers = state.selectedUsers.filter(id => id !== action.payload);
    },
  },
});

export const { setUsers, selectUser, deselectUser } = userSlice.actions;
export default userSlice.reducer;
