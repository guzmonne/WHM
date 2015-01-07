'use strict';

App.controller('NetshViewACtrl', function($scope){
  $scope.networkColours = {};

  function resetCharts(){
    $scope.data    = [];
    $scope.series  = [];
    $scope.colours = [];
  }
  
  function networkPlot(network){
    var quality      = network.quality;
    var channel      = network.channel;
    var chart        = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    channel          = parseInt(channel);
    quality          = parseInt(quality);
    chart[channel+1] = quality;
    chart[channel+2] = quality;
    chart[channel+3] = quality;
    return chart;
  }

  function networkColor(ssid){
    if (ssid === 'N/A')                return createChartColor();
    if ($scope.networkColours[ssid])   return $scope.networkColours[ssid];
    return ($scope.networkColours[ssid] = createChartColor());
  }

  function createChartColor(){
    var color = Please.make_color({format: 'rgb-string'})[0].replace('b', 'ba');
    return {
      fillColor           : color.replace(')', ',0.2)'),
      strokeColor         : color.replace(')', ',1)'),
      pointColor          : color.replace(')', ',1)'),
      pointStrokeColor    : "#fff",
      pointHighlightFill  : "#fff",
      pointHighlightStroke: color.replace(')', ',0.8)')
    };
  }

  $scope.$watch('networks', function(networks){
    resetCharts(); 
    for(var i = 0; i < networks.length ; i++){
      var network = networks[i];
      $scope.data.push( networkPlot(network) );
      $scope.series.push(network.ssid);
      $scope.colours.push( networkColor(network.ssid) );
    }
  });

  $scope.labels = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  $scope.onClick = function (points, evt) {
    //console.log(points, evt);
    //console.log($scope);
  };

  resetCharts();
  
  console.log($scope);

});