import Config from './config';
import Storage from './storage';

class Shared {
  static $inject = ['$q', '$window', 'SatellizerConfig', 'SatellizerStorage'];

  private prefixedTokenName: string;

  constructor(private $q: angular.IQService,
              private $window: angular.IWindowService,
              private SatellizerConfig: Config,
              private SatellizerStorage: Storage) {
    const { tokenName, tokenPrefix } = this.SatellizerConfig;
    this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
  }

  /**
   *
   * @returns {any}
   */
  getToken(): any {
    let token;

    token = this.SatellizerStorage.get(this.prefixedTokenName);
    token = JSON.parse(token);

    return token;
  }

  /**
   * Set TokenObject to Storage from Response of httpAuthRequest.
   * @param response Response from httpAuthRequest
   */
  setToken(response): void {

    let token;

    if (angular.isObject(response.data)) {
      token = JSON.stringify(response.data);
      this.SatellizerStorage.set(this.prefixedTokenName, token);
    }

  }

  /**
   * Removes TokenObject from Storage
   */
  removeToken(): void {
    this.SatellizerStorage.remove(this.prefixedTokenName);
  }

  isAuthenticated(): boolean {
    const token = this.SatellizerStorage.get(this.prefixedTokenName);

    if (token) {  // Token is present
      if (token.split('.').length === 3) {  // Token with a valid JWT format XXX.YYY.ZZZ
        try { // Could be a valid JWT or an access token with the same format
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const exp = JSON.parse(this.$window.atob(base64)).exp;
          if (typeof exp === 'number') {  // JWT with an optonal expiration claims
            return Math.round(new Date().getTime() / 1000) < exp;
          }
        } catch (e) {
          return true;  // Pass: Non-JWT token that looks like JWT
        }
      }
      return true;  // Pass: All other tokens
    }
    return false; // Fail: No token at all
  }

  setStorageType(type): void {
    this.SatellizerConfig.storageType = type;
  }
}

export default Shared;
