import { joinUrl } from './utils';
import Config from './config';
import Shared from './shared';

class Local {
  static $inject = ['$http', 'SatellizerConfig', 'SatellizerShared'];


  constructor(private $http: angular.IHttpService,
              private SatellizerConfig: Config,
              private SatellizerShared: Shared) {}

  /**
   *
   * @param user
   * @param options
   * @returns {IPromise<TResult>}
   */
  login(user: string|Object, options: any = {}): angular.IHttpPromise<any> {
    options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.loginUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;

    return this.$http(options).then((response) => {
      this.SatellizerShared.setToken(response);
      return response;
    });
  }

  /**
   *
   * @param data
   * @param options
   * @returns {IHttpPromise<T>}
   */
  logout(data: string|Object, options: any = {}): angular.IHttpPromise<any> {
    options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.logoutUrl);
    options.data = data || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;

    return this.$http(options).then((response) => {
      this.SatellizerShared.logout();
      return response;
    });
  }

  /**
   *
   * @param user
   * @param options
   * @returns {IHttpPromise<T>}
   */
  signup(user: string|Object, options: any = {}): angular.IHttpPromise<any> {
    options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.signupUrl);
    options.data = user || options.data;
    options.method = options.method || 'POST';
    options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;

    return this.$http(options);
  }
}

export default Local;
