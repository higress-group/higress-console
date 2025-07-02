import { createStore } from 'ice';
import user from '../src/models/user';
import config from '../src/models/config';
import system from '../src/models/system';

export default createStore({
  user,
  config,
  system,
});
