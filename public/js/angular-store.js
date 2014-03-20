angular.module('store', ['ngResource']).factory('Store', function($resource) {
    return {
        cache: $resource('/cache', {})
    }
});