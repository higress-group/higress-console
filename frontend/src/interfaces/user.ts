export interface UserInfo {
  username: string;
  displayName: string;
  type?: 'user' | 'admin' | 'guest';
  avatarUrl: string;
}

export interface LoginParams {
  username: string;
  password: string;
}
