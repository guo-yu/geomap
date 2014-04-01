var app = angular.module('map', ['store', 'leaflet-directive']);

app.controller("mainCtrler", ['$scope', 'Store',
  function($scope, Store) {

    angular.extend($scope, {
      mapcenter: {
        lat: 34.604702,
        lng: 112.359673,
        zoom: 5
      },
      layers: {
        baselayers: {
          googleHybrid: {
            name: 'Google Hybrid',
            layerType: 'HYBRID',
            type: 'google'
          },
          googleRoadmap: {
            name: 'Google Streets',
            layerType: 'ROADMAP',
            type: 'google'
          }
        }
      },
      defaults: {
        scrollWheelZoom: true
      },
      markers: []
    });

    Store.cache.get({}, function(result) {
      if (result.stat !== 'ok') return false;
      if (!result.cache || !result.cache.content) return false;
      $scope.cache = result.cache.content;
      $scope.counts = count($scope.cache);
      angular.extend($scope, {
        markers: formatMakers(result.cache.content)
      });
    });

    function count(data) {
      if (!data) return {};
      if (data.length === 0) return {};
      var counts = {};
      counts.male = 0;
      counts.female = 0;
      counts.all = 0;
      data.forEach(function(marker){
        if (marker.gender === 'M') {
          counts.male ++;
        } else {
          counts.female ++;
        }
        counts.all ++;
      });
      counts.rate = (counts.male / counts.female).toFixed(3);
      return counts;
    }

    function formatMakers(data) {
      if (!data) return [];
      if (data.length === 0) return [];
      data.forEach(function(marker){
        marker.icon = {
          type: 'div',
          iconSize: [10,10],
          html: marker.gender && marker.gender === 'M' ? 
                '<span class=\"dot\">':
                '<span class=\"dot dot-female\">',
          popupAnchor:  [0, 0]
        }
      });
      return data;
    }

  }
]);