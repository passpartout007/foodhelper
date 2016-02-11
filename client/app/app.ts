'use strict';

angular.module('foodHelperApp', ['flow', 'ui.bootstrap', 'ids']);

angular.module('foodHelperApp', [
  'foodHelperApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router', 
  'flow', 
  'frapontillo.bootstrap-switch', 
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
