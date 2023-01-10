/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { UserInfo } from 'frontend/src/interfaces/user';
import { createModel } from 'ice';

interface ModelState {
  currentUser: UserInfo;
}

export default createModel({
  state: {
    currentUser: {},
  } as ModelState,
  reducers: {
    updateCurrentUser(prevState: ModelState, payload) {
      prevState.currentUser = payload;
    },
  },
});
