'use strict';

App.controller('NetshViewACtrl', function($scope, ChartHelper){
  $scope.networkColours = {};

  $scope.options = {
    bezierCurve : false,
    pointDot    : false,
    animation   : false,
  };
  
  $scope.$watch('networks', function(networks){
    ChartHelper.resetCharts($scope); 
    for(var i = 0; i < networks.length ; i++){
      var network = networks[i];
      $scope.data.push    ( ChartHelper.networkChannelPlot(network) );
      $scope.series.push  ( network.ssid );
      $scope.colours.push ( ChartHelper.networkColor(network.ssid, $scope.networkColours) );
    }
  });

  $scope.labels = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  $scope.onClick = function (points, evt) {
    //console.log(points, evt);
    //console.log($scope);
  };

  ChartHelper.resetCharts($scope);
});