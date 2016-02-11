'use strict';

describe('Filter: ids', function () {

  // load the filter's module
  beforeEach(module('foodHelperApp'));

  // initialize a new instance of the filter before each test
  var ids;
  beforeEach(inject(function ($filter) {
    ids = $filter('ids');
  }));

  it('should return the input prefixed with "ids filter:"', function () {
    var text = 'angularjs';
    expect(ids(text)).toBe('ids filter: ' + text);
  });

});
