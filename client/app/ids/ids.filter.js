'use strict';

angular.module('foodHelperApp')
  .filter('ids', function () {
    return function (elt) {
	    return elt._id;
    };
  });
