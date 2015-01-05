'use strict';

App.controller('NetshViewACtrl', function($scope){
  function resetCharts(){
    $scope.data   = [];
    $scope.series = [];
  }
  
  function channelChart(channel, quality){
    var chart        = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    channel          = parseInt(channel);
    quality             = parseInt(quality);
    chart[channel+1] = quality;
    chart[channel+2]   = quality;
    chart[channel+3] = quality;
    return chart;
  }

  $scope.$watch('networks', function(networks){
    resetCharts(); 
    for(var i = 0; i < networks.length ; i++){
      var network = networks[i];
      $scope.data.push( channelChart(network.channel, network.quality) );
      $scope.series.push(network.ssid);
    }
  });

  $scope.labels = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  //$scope.series = ['Series A', 'Series B'];
  //$scope.data = [
  //  [65, 59, 80, 81, 56, 55, 40],
  //  [28, 48, 40, 19, 86, 27, 90]
  //];

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  resetCharts();
  
});