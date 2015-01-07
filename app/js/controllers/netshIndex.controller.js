'use strict';

var Netsh = require('./js/modules/netsh.js');

App.controller('NetshIndexCtrl', function($scope, $interval){
  var stop;

  $scope.overNetwork = {};

  $scope.over = function(network){ $scope.overNetwork = network;};

  $scope.resetOverNetwork = function(){ $scope.overNetwork = {}; };

  $scope.backgroundOnHover = function(ssid){
    if (ssid === $scope.overNetwork.ssid) {
      return {
        'color'           : $scope.$$childHead.networkColours[ssid].strokeColor,
        'background-color': $scope.$$childHead.networkColours[ssid].fillColor
      }
    }
    return {};
  };

  $scope.networks = {};

  $scope.getReadings = function(){
    Netsh.wifiNetworkScan(function(err, networks){
      if (err) return console.log(err);
      $scope.networks = networks;
      $scope.$apply();
    });
  };

  $scope.stopInterval = function(){
    if (angular.isDefined(stop)) $interval.cancel(stop);
    stop = undefined;
  };

  $scope.$on('$destroy', function(){ $scope.stopInterval(); });

  stop = $interval(function(){ $scope.getReadings(); }, 1000);

  $scope.getReadings();

});