import { RootState } from "@/stores/store";

export const selectUserRoles = (state: RootState) => state.user.roles;

export const selectUserEmail = (state: RootState) => state.user.email;

export const selectIsUserLoading = (state: RootState) =>
  state.user.isUserLoading;
