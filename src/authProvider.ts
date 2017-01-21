import Config from './config';

export default class AuthProvider {
  static $inject = ['SatellizerConfig'];

  constructor(private SatellizerConfig: Config) {}

  get baseUrl(): string { return this.SatellizerConfig.baseUrl; }
  set baseUrl(value) { this.SatellizerConfig.baseUrl = value; }

  get authenticateUrl(): string { return this.SatellizerConfig.authenticateUrl; }
  set authenticateUrl(value) { this.SatellizerConfig.authenticateUrl = value; }

  get revokeUrl(): string {return this.SatellizerConfig.revokeUrl;}
  set revokeUrl(value) { this.SatellizerConfig.revokeUrl = value; }

  get tokenRoot(): string { return this.SatellizerConfig.tokenRoot; }
  set tokenRoot(value) { this.SatellizerConfig.tokenRoot = value; }

  get tokenName(): string { return this.SatellizerConfig.tokenName; }
  set tokenName(value) { this.SatellizerConfig.tokenName = value; }

  get tokenPrefix(): string { return this.SatellizerConfig.tokenPrefix; }
  set tokenPrefix(value) { this.SatellizerConfig.tokenPrefix = value; }

  get tokenHeader(): string { return this.SatellizerConfig.tokenHeader; }
  set tokenHeader(value) { this.SatellizerConfig.tokenHeader = value; }

  get tokenType(): string { return this.SatellizerConfig.tokenType; }
  set tokenType(value) { this.SatellizerConfig.tokenType = value; }

  get withCredentials(): boolean { return this.SatellizerConfig.withCredentials; }
  set withCredentials(value) { this.SatellizerConfig.withCredentials = value; }

  get storageType(): string { return this.SatellizerConfig.storageType; }
  set storageType(value) { this.SatellizerConfig.storageType = value; }

  get httpInterceptor(): boolean { return this.SatellizerConfig.httpInterceptor; }
  set httpInterceptor(value) {
    if (typeof value === 'function') {
      this.SatellizerConfig.httpInterceptor = value;
    } else {
      this.SatellizerConfig.httpInterceptor = () => value;
    }
  }

  $get(SatellizerShared, SatellizerLocal): any {
    return {
      authenticate: (user) => SatellizerLocal.authenticate(user),
      revoke: () => SatellizerLocal.revoke(),
      isAuthenticated: () => SatellizerShared.isAuthenticated(),
      getToken: () => SatellizerShared.getToken(),
      setToken: (token) => SatellizerShared.setToken({ access_token: token }),
      removeToken: () => SatellizerShared.removeToken(),
      setStorageType: (type) => SatellizerShared.setStorageType(type)
    };
  }
}

AuthProvider.prototype.$get.$inject = ['SatellizerShared', 'SatellizerLocal'];
