'use strict';

var Netsh = require('./js/modules/netsh.js');

App.controller('NetshIndexCtrl', function($scope, $interval){
  var stop;

  $scope.networks = {};

  $scope.getReadings = function(){
    Netsh.wifiNetworkScan(function(err, networks){
      if (err) return console.log(err);
      $scope.networks = networks;
      $scope.$apply();
    });
  };

  $scope.stopReadings = function(){
    if (angular.isDefined(stop)) $interval.cancel(stop);
    stop = undefined;
  };

  stop = $interval(function(){ $scope.getReadings(); }, 1000);

  $scope.$on('$destroy', function(){ $scope.stopReadings(); });

  $scope.getReadings();

});