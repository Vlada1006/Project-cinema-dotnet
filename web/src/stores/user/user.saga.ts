import { call, put, takeEvery } from "redux-saga/effects";
import { FETCH_USER_ACTION } from "./constants";
import { setUser } from "./user.slice";
import { UserResponse } from "./types";

export function* fetchUserSaga(): Generator<unknown, UserResponse | null> {
  try {
    // yield put(setIsUserLoading(true));

    const apiResponsePromise = yield call(fetch, "/api/users/me");

    if (!apiResponsePromise.ok) {
      throw new Error("Failed to fetch current user");
    }

    const { user }: { user: UserResponse | null } =
      yield apiResponsePromise.json();

    if (user) {
      yield put(setUser(user));
    }

    return user || null;
  } catch (error) {
    // TODO: dispatch error
    console.error("Error fetching user:", error);
  } finally {
  }

  return null;
}

export function* userSaga() {
  yield takeEvery(FETCH_USER_ACTION, fetchUserSaga);
}
