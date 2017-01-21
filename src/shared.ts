import Config from "./config";
import Storage from "./storage";

class Shared {
  static $inject = ['$q', '$window', 'SatellizerConfig', 'SatellizerStorage'];

  private prefixedTokenName: string;

  constructor(private $q: angular.IQService,
              private $window: angular.IWindowService,
              private SatellizerConfig: Config,
              private SatellizerStorage: Storage) {
    const {tokenName, tokenPrefix} = this.SatellizerConfig;
    this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
  }

  /**
   * Get TokenObject from Storage
   * @returns {any}
   */
  getToken(): any {
    return JSON.parse(this.SatellizerStorage.get(this.prefixedTokenName));
  }

  /**
   * Set TokenObject to Storage from Response of httpAuthRequest.
   * @param response Response from httpAuthRequest
   */
  setToken(response): void {
    if (angular.isObject(response.data)) {
      this.SatellizerStorage.set(this.prefixedTokenName, JSON.stringify(response.data));
    }
  }

  /**
   * Removes TokenObject from Storage
   */
  removeToken(): void {
    this.SatellizerStorage.remove(this.prefixedTokenName);
  }

  getTokensFromObject(): any {

    let data = this.getToken();
    let tokens: string[] = [];

    if ("access_token" in data) {
      tokens.push(data['access_token']);
    }

    if ("refresh_token" in data) {
      tokens.push(data['refresh_token']);
    }

    return tokens;

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
