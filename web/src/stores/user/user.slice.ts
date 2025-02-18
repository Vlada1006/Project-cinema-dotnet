import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FETCH_USER_ACTION } from "./constants";
import { UserResponse, UserStore } from "./types";

const initialState: UserStore = {
  id: null,
  email: null,
  roles: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserResponse>) => {
      const { email, roles, id } = action.payload;
      state.id = id;
      state.email = email;
      state.roles = roles;
    },

    clearUserStore: (state) => {
      state.email = null;
      state.roles = null;
    },
  },
});

export const fetchUser = createAction(FETCH_USER_ACTION);

export const { setUser, clearUserStore } = userSlice.actions;
