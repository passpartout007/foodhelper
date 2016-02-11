'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Vos plats',
    'state': 'main',
    'icon' : 'list'
  }, {
    'title': 'Archivés', 
    'state': 'archive',
    'icon' : 'trash'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor() {
  }
}

angular.module('foodHelperApp')
  .controller('NavbarController', NavbarController);
