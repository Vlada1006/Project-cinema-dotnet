import { all, fork } from "redux-saga/effects";
import { userSaga } from "./user/user.saga";

const sagas = [userSaga];

export function* rootSaga() {
  yield all(sagas.map(fork));
}
