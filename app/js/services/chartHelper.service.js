'use strict';

App.service('ChartHelper', function(ArrayHelper){
  return {
    resetCharts: function(object){
      object.data    = [];
      object.series  = [];
      object.colours = [];
    },
    networkChannelPlot: function(network){
      var quality      = network.quality;
      var channel      = network.channel;
      var chart        = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      channel          = parseInt(channel);
      quality          = parseInt(quality);
      chart[channel+1] = quality;
      chart[channel+2] = quality;
      chart[channel+3] = quality;
      return chart;
    },
    createChartColor: function(){
      var color = Please.make_color({format: 'rgb-string'})[0].replace('b', 'ba');
      return {
        fillColor           : color.replace(')', ',0.2)'),
        strokeColor         : color.replace(')', ',1)'),
        pointColor          : color.replace(')', ',1)'),
        pointStrokeColor    : "#fff",
        pointHighlightFill  : "#fff",
        pointHighlightStroke: color.replace(')', ',0.8)')
      };
    },
    networkColor: function(ssid, colors){
      if (ssid === 'N/A') return this.createChartColor();
      if (colors[ssid])   return colors[ssid];
      return ( colors[ssid] = this.createChartColor() );
    },
    newNetworkSeries: function(object, network, colours){
      object.data.push   ( ArrayHelper.shiftData(ArrayHelper.zeroArray(30), network.quality) );
      object.series.push ( network.ssid );
      object.colours.push( colours[network.ssid] );
    },
  };
});