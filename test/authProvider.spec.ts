import Config from '../src/config';
import Storage from '../src/storage';
import Shared from '../src/shared';
import Local from '../src/local';
import AuthProvider from '../src/authProvider';

let window;
let http;
let httpBackend;
let config;
let authProvider;
let storage;
let shared;
let popup;
let oauth1;
let oauth2;
let oauth;
let local;
let auth;
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZTU3ZDZiY2MzNmMxNTgwNzU4NDJkZCIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJfX3YiOjB9LCJpYXQiOjE0MDc1NDg3ODI5NzMsImV4cCI6MTQwODE1MzU4Mjk3M30.1Ak6mij5kfkSi6d_wtPOx4yK7pS7ZFSiwbkL7AJbnYs';

describe('AuthProvider', () => {

  beforeEach(() => {
    config = new Config();
    authProvider = new AuthProvider(config);
  });

  beforeEach(angular.mock.inject(($q, $http, $window, $interval, $timeout, $httpBackend) => {
    window = $window;
    http = $http;
    httpBackend = $httpBackend;
    storage = new Storage($window, config);
    shared = new Shared($q, $window, config, storage);
    local = new Local($http, config, shared);
    auth = authProvider.$get(shared, local, oauth);
  }));

  it('should set baseUrl', () => {
    authProvider.baseUrl = '/api/v2/';
    expect(authProvider.baseUrl).toEqual('/api/v2/');
  });

  it('should set authenticateUrl', () => {
    authProvider.authenticateUrl = '/api/sign_in';
    expect(authProvider.authenticateUrl).toEqual('/api/auth');
  });

  it('should set revokeUrl', () => {
    authProvider.revokeUrl = '/api/sign_in';
    expect(authProvider.revokeUrl).toEqual('/api/revoke');
  });

  it('should set tokenRoot', () => {
    authProvider.tokenRoot = 'deep.nested.object';
    expect(authProvider.tokenRoot).toEqual('deep.nested.object');
  });

  it('should set tokenName', () => {
    authProvider.tokenName = 'access_token';
    expect(authProvider.tokenName).toEqual('access_token');
  });

  it('should set tokenPrefix', () => {
    authProvider.tokenPrefix = 'myApp';
    expect(authProvider.tokenPrefix).toEqual('myApp');
  });

  it('should set tokenHeader', () => {
    authProvider.tokenHeader = 'x-auth-token';
    expect(authProvider.tokenHeader).toEqual('x-auth-token');
  });

  it('should set tokenType', () => {
    authProvider.tokenType = 'TOKEN';
    expect(authProvider.tokenType).toEqual('TOKEN');
  });

  it('should set withCredentials', () => {
    authProvider.withCredentials = false;
    expect(authProvider.withCredentials).toEqual(false);
  });

  it('should set storageType', () => {
    authProvider.storageType = 'sessionStorage';
    expect(authProvider.storageType).toEqual('sessionStorage');
  });

  it('should set httpInterceptor as a boolean', () => {
    authProvider.httpInterceptor = false;
    expect(authProvider.httpInterceptor()).toEqual(false);
  });

  it('should set httpInterceptor as a function', () => {
    authProvider.httpInterceptor = (request) => {
      return request.uri.indexOf('/api/') === 0;
    };
    expect(authProvider.httpInterceptor({ uri: '/somewhere/else' })).toEqual(false);
  });

  describe('$auth service', () => {

    it('should be defined', () => {
      expect(auth).toBeDefined();
    });

    describe('authenticate()', () => {

      it('should be defined', () => {
        expect(auth.authenticate).toBeDefined();
      });

      it('should authenticate', () => {
        spyOn(oauth, 'authenticate');
        auth.authenticate('facebook');
        expect(oauth.authenticate).toHaveBeenCalled();
      });

    });

    describe('isAuthenticated()', () => {

      it('should be defined', () => {
        expect(auth.isAuthenticated).toBeDefined();
      });

      it('should check if user is authenticated', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        window[storageType][tokenName] = token;
        expect(auth.isAuthenticated()).toBe(true);
      });

    });

    describe('getToken()', () => {

      it('should be defined', () => {
        expect(auth.getToken).toBeDefined();
      });

      it('should get token', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        window[storageType][tokenName] = token;
        expect(auth.getToken()).toEqual(window[storageType][tokenName]);
      });

    });

    describe('setToken()', () => {

      it('should be defined', () => {
        expect(auth.setToken).toBeDefined();
      });

      it('should set token', () => {
        const response = {
          data: {
            token: token
          }
        };
        auth.setToken(response);
        expect(token).toEqual(auth.getToken());
      });

    });

    describe('removeToken()', () => {

      it('should be defined', () => {
        expect(auth.removeToken).toBeDefined();
      });

      it('should remove token', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        window[storageType][tokenName] = token;
        auth.removeToken();
        expect(window.localStorage[tokenName]).toBeUndefined();
      });

    });

    describe('revoke()', () => {

      it('should be defined', () => {
        expect(auth.revoke).toBeDefined();
      });

      it('should log out a user', () => {
        const storageType = config.storageType;
        const tokenName = [config.tokenPrefix, config.tokenName].join('_');
        auth.revoke();
        expect([storageType][tokenName]).toBeUndefined();
      });

    });

    describe('authenticate()', () => {

      it('should be defined', () => {
        expect(auth.authenticate).toBeDefined();
      });

      it('should be able to call authenticate', function () {
        spyOn(local, 'authenticate');
        const user = { email: 'foo@bar.com', password: '1234' };
        auth.authenticate(user);
        expect(local.authenticate).toHaveBeenCalled();
      });

      describe('setStorageType()', () => {

        it('should be defined', () => {
          expect(auth.setStorageType).toBeDefined();
        });

        it('should set storage type', () => {
          auth.setStorageType('sessionStorage');
          expect(config.storageType).toBe('sessionStorage');
        });

      });

    });

  });

});
