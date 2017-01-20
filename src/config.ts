export default class Config {
  static get getConstant() {
    return new Config();
  }

  baseUrl = '/';
  authenticateUrl = '/auth/authenticate';
  revokeUrl = '/auth/revoke';
  tokenName = 'token';
  tokenPrefix = 'satellizer';
  tokenHeader = 'Authorization';
  tokenType = 'Bearer';
  storageType = 'localStorage';
  tokenRoot = null;
  withCredentials = false;
  httpInterceptor: any = (): boolean => true;
};
