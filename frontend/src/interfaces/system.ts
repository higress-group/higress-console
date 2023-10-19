export interface UserInfo {
  name: string;
  displayName: string;
  password?: string;
  type?: 'user' | 'admin' | 'guest';
  avatarUrl?: string;
}

export interface InitParams {
  adminUser: UserInfo;
  configs?: object;
}
