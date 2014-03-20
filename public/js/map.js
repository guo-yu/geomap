var app = angular.module('map', ['store','leaflet-directive']);

app.controller("mainCtrler", ['$scope', 'Store', function($scope, Store) {

    angular.extend($scope, {
        mapcenter: {
            lat: 25.0391667,
            lng: 121.525,
            zoom: 6
        },
        defaults: {
            scrollWheelZoom: true
        },
        markers: []
    });

    Store.cache.get({}, function(result) {
        if (result.stat !== 'ok') return false;
        angular.extend($scope, {
            markers: result.content
        });
    });
    
}]);