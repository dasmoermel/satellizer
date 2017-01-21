import {joinUrl} from "./utils";
import Config from "./config";
import Shared from "./shared";

class Local {
  static $inject = ['$http', 'SatellizerConfig', 'SatellizerShared'];


  constructor(private $http: angular.IHttpService,
              private SatellizerConfig: Config,
              private SatellizerShared: Shared) {
  }

  /**
   * Sends Authentication Request and saves TokenObject in Storage
   * @param data Given UserData
   * @returns {IPromise<TResult>}
   */
  authenticate(data: Object): angular.IHttpPromise<any> {

    let options: any = {};

    options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.authenticateUrl);
    options.data = data;
    options.method = 'POST';
    options.withCredentials = this.SatellizerConfig.withCredentials;

    return this.$http(options).then((response) => {
      if (response.status == 200) {
        this.SatellizerShared.setToken(response);
      }
      return response;
    });
  }

  /**
   * Send Revokation Request and removes TokenObject from Storage.
   * @returns {IHttpPromise<T>}
   */
  revoke(): angular.IHttpPromise<any> {

    let options: any = {};

    let tokens = {
      "token": this.SatellizerShared.getTokensFromObject(),
    };

    options.url = joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.revokeUrl);
    options.data = tokens;
    options.method = 'POST';
    options.withCredentials = this.SatellizerConfig.withCredentials;

    return this.$http(options).then((response) => {
      if (response.status == 200) {
        this.SatellizerShared.removeToken();
      }
      return response;
    });
  }
}

export default Local;
