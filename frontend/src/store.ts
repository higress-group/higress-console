import { createStore } from 'ice';
import user from '../src/models/user';
import config from '../src/models/config';
import system from '../src/models/system';
import mcp from '../src/models/mcp';

export default createStore({
  user,
  config,
  system,
  mcp,
});
