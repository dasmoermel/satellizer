import Config from './config';
import AuthProvider from './authProvider';
import Shared from './shared';
import Local from './local';
import Storage from './storage';
import Interceptor from './interceptor';
import HttpProviderConfig from './httpProviderConfig';

angular.module('satellizer', [])
  .provider('$auth', ['SatellizerConfig', (SatellizerConfig) => new AuthProvider(SatellizerConfig)])
  .constant('SatellizerConfig', Config.getConstant)
  .service('SatellizerShared', Shared)
  .service('SatellizerLocal', Local)
  .service('SatellizerStorage', Storage)
  .service('SatellizerInterceptor', Interceptor)
  .config(['$httpProvider', ($httpProvider) => new HttpProviderConfig($httpProvider)]);

export default 'satellizer';

