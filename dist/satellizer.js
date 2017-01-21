/**
 * Satellizer 0.15.5
 * (c) 2016 Sahat Yalkabov 
 * License: MIT 
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.satellizer = factory());
}(this, (function () { 'use strict';

var Config = (function () {
    function Config() {
        this.baseUrl = '/';
        this.authenticateUrl = '/oauth2/token';
        this.revokeUrl = '/oauth2/revoke';
        this.tokenName = 'token';
        this.tokenPrefix = 'satellizer';
        this.tokenHeader = 'Authorization';
        this.tokenType = 'Bearer';
        this.storageType = 'localStorage';
        this.tokenRoot = null;
        this.withCredentials = false;
        this.httpInterceptor = function () { return true; };
    }
    Object.defineProperty(Config, "getConstant", {
        get: function () {
            return new Config();
        },
        enumerable: true,
        configurable: true
    });
    return Config;
}());

var AuthProvider = (function () {
    function AuthProvider(SatellizerConfig) {
        this.SatellizerConfig = SatellizerConfig;
    }
    Object.defineProperty(AuthProvider.prototype, "baseUrl", {
        get: function () { return this.SatellizerConfig.baseUrl; },
        set: function (value) { this.SatellizerConfig.baseUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "authenticateUrl", {
        get: function () { return this.SatellizerConfig.authenticateUrl; },
        set: function (value) { this.SatellizerConfig.authenticateUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "revokeUrl", {
        get: function () { return this.SatellizerConfig.revokeUrl; },
        set: function (value) { this.SatellizerConfig.revokeUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenRoot", {
        get: function () { return this.SatellizerConfig.tokenRoot; },
        set: function (value) { this.SatellizerConfig.tokenRoot = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenName", {
        get: function () { return this.SatellizerConfig.tokenName; },
        set: function (value) { this.SatellizerConfig.tokenName = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenPrefix", {
        get: function () { return this.SatellizerConfig.tokenPrefix; },
        set: function (value) { this.SatellizerConfig.tokenPrefix = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenHeader", {
        get: function () { return this.SatellizerConfig.tokenHeader; },
        set: function (value) { this.SatellizerConfig.tokenHeader = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "tokenType", {
        get: function () { return this.SatellizerConfig.tokenType; },
        set: function (value) { this.SatellizerConfig.tokenType = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "withCredentials", {
        get: function () { return this.SatellizerConfig.withCredentials; },
        set: function (value) { this.SatellizerConfig.withCredentials = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "storageType", {
        get: function () { return this.SatellizerConfig.storageType; },
        set: function (value) { this.SatellizerConfig.storageType = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "httpInterceptor", {
        get: function () { return this.SatellizerConfig.httpInterceptor; },
        set: function (value) {
            if (typeof value === 'function') {
                this.SatellizerConfig.httpInterceptor = value;
            }
            else {
                this.SatellizerConfig.httpInterceptor = function () { return value; };
            }
        },
        enumerable: true,
        configurable: true
    });
    AuthProvider.prototype.$get = function (SatellizerShared, SatellizerLocal) {
        return {
            authenticate: function (user) { return SatellizerLocal.authenticate(user); },
            revoke: function () { return SatellizerLocal.revoke(); },
            isAuthenticated: function () { return SatellizerShared.isAuthenticated(); },
            getToken: function () { return SatellizerShared.getToken(); },
            setToken: function (token) { return SatellizerShared.setToken({ access_token: token }); },
            removeToken: function () { return SatellizerShared.removeToken(); },
            setStorageType: function (type) { return SatellizerShared.setStorageType(type); }
        };
    };
    AuthProvider.$inject = ['SatellizerConfig'];
    return AuthProvider;
}());
AuthProvider.prototype.$get.$inject = ['SatellizerShared', 'SatellizerLocal'];

var Shared = (function () {
    function Shared($q, $window, SatellizerConfig, SatellizerStorage) {
        this.$q = $q;
        this.$window = $window;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerStorage = SatellizerStorage;
        var _a = this.SatellizerConfig, tokenName = _a.tokenName, tokenPrefix = _a.tokenPrefix;
        this.prefixedTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_') : tokenName;
    }
    /**
     * Get TokenObject from Storage
     * @returns {any}
     */
    Shared.prototype.getToken = function () {
        return JSON.parse(this.SatellizerStorage.get(this.prefixedTokenName));
    };
    /**
     * Set TokenObject to Storage from Response of httpAuthRequest.
     * @param response Response from httpAuthRequest
     */
    Shared.prototype.setToken = function (response) {
        if (angular.isObject(response.data)) {
            this.SatellizerStorage.set(this.prefixedTokenName, JSON.stringify(response.data));
        }
    };
    /**
     * Removes TokenObject from Storage
     */
    Shared.prototype.removeToken = function () {
        this.SatellizerStorage.remove(this.prefixedTokenName);
    };
    Shared.prototype.getTokensFromObject = function () {
        var data = this.getToken();
        var tokens = [];
        if ("access_token" in data) {
            tokens.push(data['access_token']);
        }
        if ("refresh_token" in data) {
            tokens.push(data['refresh_token']);
        }
        return tokens;
    };
    Shared.prototype.isAuthenticated = function () {
        var token = this.SatellizerStorage.get(this.prefixedTokenName);
        if (token) {
            if (token.split('.').length === 3) {
                try {
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace('-', '+').replace('_', '/');
                    var exp = JSON.parse(this.$window.atob(base64)).exp;
                    if (typeof exp === 'number') {
                        return Math.round(new Date().getTime() / 1000) < exp;
                    }
                }
                catch (e) {
                    return true; // Pass: Non-JWT token that looks like JWT
                }
            }
            return true; // Pass: All other tokens
        }
        return false; // Fail: No token at all
    };
    Shared.prototype.setStorageType = function (type) {
        this.SatellizerConfig.storageType = type;
    };
    Shared.$inject = ['$q', '$window', 'SatellizerConfig', 'SatellizerStorage'];
    return Shared;
}());

function joinUrl(baseUrl, url) {
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
        return url;
    }
    var joined = [baseUrl, url].join('/');
    var normalize = function (str) {
        return str
            .replace(/[\/]+/g, '/')
            .replace(/\/\?/g, '?')
            .replace(/\/\#/g, '#')
            .replace(/\:\//g, '://');
    };
    return normalize(joined);
}

var Local = (function () {
    function Local($http, SatellizerConfig, SatellizerShared) {
        this.$http = $http;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerShared = SatellizerShared;
    }
    /**
     * Sends Authentication Request and saves TokenObject in Storage
     * @param data Given UserData
     * @returns {IPromise<TResult>}
     */
    Local.prototype.authenticate = function (data) {
        var _this = this;
        var options = {};
        options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.authenticateUrl);
        options.data = data;
        options.method = 'POST';
        options.withCredentials = this.SatellizerConfig.withCredentials;
        return this.$http(options).then(function (response) {
            if (response.status == 200) {
                _this.SatellizerShared.setToken(response);
            }
            return response;
        });
    };
    /**
     * Send Revokation Request and removes TokenObject from Storage.
     * @returns {IHttpPromise<T>}
     */
    Local.prototype.revoke = function () {
        var _this = this;
        var options = {};
        var tokens = {
            "token": this.SatellizerShared.getTokensFromObject(),
        };
        options.url = joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.revokeUrl);
        options.data = tokens;
        options.method = 'POST';
        options.withCredentials = this.SatellizerConfig.withCredentials;
        return this.$http(options).then(function (response) {
            if (response.status == 200) {
                _this.SatellizerShared.removeToken();
            }
            return response;
        });
    };
    Local.$inject = ['$http', 'SatellizerConfig', 'SatellizerShared'];
    return Local;
}());

var Storage = (function () {
    function Storage($window, SatellizerConfig) {
        this.$window = $window;
        this.SatellizerConfig = SatellizerConfig;
        this.memoryStore = {};
    }
    Storage.prototype.get = function (key) {
        try {
            return this.$window[this.SatellizerConfig.storageType].getItem(key);
        }
        catch (e) {
            return this.memoryStore[key];
        }
    };
    Storage.prototype.set = function (key, value) {
        try {
            this.$window[this.SatellizerConfig.storageType].setItem(key, value);
        }
        catch (e) {
            this.memoryStore[key] = value;
        }
    };
    Storage.prototype.remove = function (key) {
        try {
            this.$window[this.SatellizerConfig.storageType].removeItem(key);
        }
        catch (e) {
            delete this.memoryStore[key];
        }
    };
    Storage.$inject = ['$window', 'SatellizerConfig'];
    return Storage;
}());

var Interceptor = (function () {
    function Interceptor(SatellizerConfig, SatellizerShared, SatellizerStorage) {
        var _this = this;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerShared = SatellizerShared;
        this.SatellizerStorage = SatellizerStorage;
        this.request = function (config) {
            if (config['skipAuthorization']) {
                return config;
            }
            if (_this.SatellizerShared.isAuthenticated() && _this.SatellizerConfig.httpInterceptor()) {
                var tokenName = _this.SatellizerConfig.tokenPrefix ?
                    [_this.SatellizerConfig.tokenPrefix, _this.SatellizerConfig.tokenName].join('_') : _this.SatellizerConfig.tokenName;
                var token = _this.SatellizerStorage.get(tokenName);
                if (_this.SatellizerConfig.tokenHeader && _this.SatellizerConfig.tokenType) {
                    token = _this.SatellizerConfig.tokenType + ' ' + token;
                }
                config.headers[_this.SatellizerConfig.tokenHeader] = token;
            }
            return config;
        };
    }
    Interceptor.Factory = function (SatellizerConfig, SatellizerShared, SatellizerStorage) {
        return new Interceptor(SatellizerConfig, SatellizerShared, SatellizerStorage);
    };
    Interceptor.$inject = ['SatellizerConfig', 'SatellizerShared', 'SatellizerStorage'];
    return Interceptor;
}());
Interceptor.Factory.$inject = ['SatellizerConfig', 'SatellizerShared', 'SatellizerStorage'];

var HttpProviderConfig = (function () {
    function HttpProviderConfig($httpProvider) {
        this.$httpProvider = $httpProvider;
        $httpProvider.interceptors.push(Interceptor.Factory);
    }
    HttpProviderConfig.$inject = ['$httpProvider'];
    return HttpProviderConfig;
}());

angular.module('satellizer', [])
    .provider('$auth', ['SatellizerConfig', function (SatellizerConfig) { return new AuthProvider(SatellizerConfig); }])
    .constant('SatellizerConfig', Config.getConstant)
    .service('SatellizerShared', Shared)
    .service('SatellizerLocal', Local)
    .service('SatellizerStorage', Storage)
    .service('SatellizerInterceptor', Interceptor)
    .config(['$httpProvider', function ($httpProvider) { return new HttpProviderConfig($httpProvider); }]);
var ng1 = 'satellizer';

return ng1;

})));
//# sourceMappingURL=satellizer.js.map
