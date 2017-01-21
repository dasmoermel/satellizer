export default class Config {
  static get getConstant() {
    return new Config();
  }

  baseUrl = '/';
  authenticateUrl = '/oauth2/token';
  revokeUrl = '/oauth2/revoke';
  tokenName = 'token';
  tokenPrefix = 'satellizer';
  tokenHeader = 'Authorization';
  tokenType = 'Bearer';
  storageType = 'localStorage';
  tokenRoot = null;
  withCredentials = false;
  httpInterceptor: any = (): boolean => true;
};
