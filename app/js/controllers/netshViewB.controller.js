'use strict';

App.controller('NetshViewBCtrl', ['$scope', '$interval', 'ChartHelper', 'ArrayHelper', 'lodash', function($scope, $interval, ChartHelper, ArrayHelper, _){
  var stop;
  var cachedNetworks = {};

  $scope.stopInterval = function(){
    if (angular.isDefined(stop)) $interval.cancel(stop);
    stop = undefined;
  };

  $scope.$on('$destroy', function(){ $scope.stopInterval(); });

  stop = $interval(function(){
    ArrayHelper.shiftData( $scope.labels, ( parseInt($scope.labels[$scope.labels.length - 1]) | 0) + 1 );
    var colours = $scope.$$prevSibling.networkColours;
    var result = {
      data    : [],
      series  : [],
      colours : [],
    };
    var activeNetworks = {};
    _.each(cachedNetworks, function(cachedNetwork){ cachedNetwork.active = false; });
    _.each($scope.networks, function(network){
      ChartHelper.historicQualityPlot(network, cachedNetworks, colours);
    });
    _.each(_.keys(cachedNetworks), function(networkID){
      var cachedNetwork = cachedNetworks[networkID];
      if(cachedNetwork.active){
        result.data.push(cachedNetwork.data);
      } else {
        result.data.push(ArrayHelper.shiftData(cachedNetwork.data, 0));
        if (cachedNetwork.data.reduce(function(o, n){ return o + n }) === 0) delete cachedNetworks[networkID];
      }
      result.series.push (cachedNetwork.ssid);
      result.colours.push(ChartHelper.networkColor(cachedNetwork.ssid, colours));
    });
    $scope.data    = result.data;
    $scope.series  = result.series;
    $scope.colours = result.colours;
  }, 1000);

  $scope.options = { 
    datasetFill : false,
    //bezierCurve : false,
    animation   : false,
    pointDot    : false,
  };

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  
  $scope.labels  = ArrayHelper.stringValueArray(30, '');
  ChartHelper.resetCharts($scope);
}]);