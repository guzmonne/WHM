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
    historicQualityPlot: function(network, cachedNetworks, colours){
      var networkID     = network.ssid + network.channel;
      var cachedNetwork = cachedNetworks[networkID];
      if (cachedNetwork){
        this.shiftChartData(network, cachedNetwork);
      } else {
        cachedNetwork = cachedNetworks[networkID] = this.newNetworkSeries(network, colours);
      }
      return cachedNetwork.data;
    },
    shiftChartData: function(network, cachedNetwork){
      ArrayHelper.shiftData(cachedNetwork.data, network.quality);
      cachedNetwork.active = true;
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
    newNetworkSeries: function(network, colours){
      return {
        data   : ArrayHelper.shiftData(ArrayHelper.zeroArray(30), network.quality),
        ssid   : network.ssid,
        colour : colours[network.ssid],
        active : true
      };
      //object.data.push   ( ArrayHelper.shiftData(ArrayHelper.zeroArray(30), network.quality) );
      //object.series.push ( network.ssid );
      //object.colours.push( colours[network.ssid] );
    },
    pushNewNetwork: function(object, network){
      object.data.push   (network.data);
      object.series.push (network.ssid);
      object.colours.push(network.colour);
    },
  };
});