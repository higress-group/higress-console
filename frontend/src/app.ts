import { defineAuthConfig } from '@ice/plugin-auth/esm/types';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineAppConfig, defineDataLoader } from 'ice';
import './i18n';
import { fetchUserInfo } from './services/user';
import store from './store';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
}));

export const authConfig = defineAuthConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialAuth: {
      admin: userInfo.type === 'admin',
      user: userInfo.type === 'user',
    },
  };
});

export const storeConfig = defineStoreConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialStates: {
      user: {
        currentUser: userInfo,
      },
    },
  };
});

export const dataLoader = defineDataLoader(async () => {
  const userInfo = await getUserInfo();
  return {
    userInfo,
  };
});

async function getUserInfo() {
  const userInfo = await fetchUserInfo();
  return userInfo;
}
