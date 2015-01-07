'use strict';

App.controller('NetshViewBCtrl', ['$scope', '$interval', 'ChartHelper', 'ArrayHelper', 'lodash', function($scope, $interval, ChartHelper, ArrayHelper, _){
  var stop;

  $scope.stopInterval = function(){
    if (angular.isDefined(stop)) $interval.cancel(stop);
    stop = undefined;
  };

  $scope.$on('$destroy', function(){ $scope.stopInterval(); });

  stop = $interval(function(){
    ArrayHelper.shiftData( $scope.labels, ( parseInt($scope.labels[$scope.labels.length - 1]) | 0) + 1 );
    for(var i = 0; i < $scope.networks.length; i++){
      var network = $scope.networks[i];
      var index   = $scope.series.indexOf(network.ssid);
      if (index > -1){
        $scope.data[index] = ArrayHelper.shiftData($scope.data[index], network.quality);
      } else {
        ChartHelper.newNetworkSeries($scope, network, $scope.$$prevSibling.networkColours);
      }
    }
    console.log(_, $scope.$$prevSibling.networkColours);
  }, 1000);

  $scope.options = { 
    datasetFill : false,
    bezierCurve : false,
    animation   : false,
    pointDot    : false,
  };

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  
  $scope.labels  = ArrayHelper.stringValueArray(30, '');
  ChartHelper.resetCharts($scope);
}]);