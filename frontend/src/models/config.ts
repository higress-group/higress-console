/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createModel } from 'ice';

interface ModelState {
  properties: any;
}

export default createModel({
  state: {
    properties: {},
  } as ModelState,
  reducers: {
    updateProperties(prevState: ModelState, payload) {
      prevState.properties = payload;
    },
  },
});
