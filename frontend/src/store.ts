import { createStore } from 'ice';
import user from '../src/models/user';
import config from '../src/models/config';

export default createStore({
  user,
  config
});
