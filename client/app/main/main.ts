'use strict';

angular.module('foodHelperApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      }).state('archive', {
        url: '/archives',
        templateUrl: 'app/main/archives.html',
        controller: 'MainController',
        controllerAs: 'main'
      }).state('shoplist', {
        url: '/shoplist/:shoplist',
        templateUrl: 'app/main/shoplist.html',
        controller: 'ShoplistController',
        controllerAs: 'shoplist'
      });
  });
