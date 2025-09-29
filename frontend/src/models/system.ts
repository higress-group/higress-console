/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createModel } from 'ice';

interface ModelState {
  version: string;
  capabilities?: string[];
}

export default createModel({
  state: {
    version: '',
  } as ModelState,
  reducers: {
    updateSystemInfo(prevState: ModelState, payload) {
      Object.assign(prevState, payload);
    },
  },
});
