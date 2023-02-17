import { defineAuthConfig } from '@ice/plugin-auth/esm/types';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineAppConfig, defineDataLoader } from 'ice';
import './i18n';
import { UserInfo } from './interfaces/user';
import { fetchUserInfo } from './services/user';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
}));

export const authConfig = defineAuthConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialAuth: {
      admin: userInfo && userInfo.type === 'admin',
      user: userInfo && userInfo.type === 'user',
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
  let userInfo: UserInfo;
  try {
    userInfo = await getUserInfo();
  } catch (e) {
    userInfo = {
      username: '',
      displayName: ''
    };
  }
  return {
    userInfo,
  };
});

async function getUserInfo(): Promise<UserInfo> {
  const userInfo = await fetchUserInfo();
  return userInfo;
}
