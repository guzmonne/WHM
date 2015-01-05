'use strict';

var spawn = require('child_process').spawn;

var Netsh = {
  logResults: function(err, data, raw){
    if (err) console.log(err);
    console.log(data);
    //console.log(raw);
  },
  wifiNetworkScan: function(callback){
    var self  = this;
    var res   = '';
    var netsh = spawn('netsh', ['wlan', 'show', 'networks', 'mode=bssid']);
    // 'Data' Event
    netsh.stdout.on('data', function(data){ res += data; });
    // 'Error' Event
    netsh.stderr.on('data', function(data){ console.log('[Error!]: ' + data); });
    // 'Close' Event
    netsh.on('close', function(code){
      if (code !== 0) return callback(new Error(code));
      self.parseData(res.split('\r\n\r\n'), callback);
    });
  },
  max: function(array){ return Math.max.apply(null, array); },
  parse: function(regexp, raw){
    var result = '', match = raw.match( (new RegExp(regexp)) );
    if (match && match.length == 2) result = match[1];
    return result;
  },
  parseSSID     : function(raw){ return this.parse(/^SSID [0-9]+ : (.+)/, raw); },
  parseAuth     : function(raw){ return this.parse(/ +Autenticaci�n + : (.+)/, raw); },
  parseCyph     : function(raw){ return this.parse(/ +Cifrado + : (.+)/, raw); },
  parseBSSID    : function(raw){ return this.parse(/^BSSID [0-9]+ +: (.+)/, raw); },
  parseQuality  : function(raw){ return this.parse(/ +Se�al +: ([0-9]+)%/, raw); },
  parseRadio    : function(raw){ return this.parse(/ +Tipo de radio +: ([0-9nabgc\.]+)/, raw); },
  parseChannel  : function(raw){ return this.parse(/ +Canal +: ([0-9]+)/, raw); },
  parseSpeeds   : function(raw){ return this.parse(/ +Velocidades b�sicas \(Mbps\): ([0-9 \.]+)/, raw); },
  parseOSpeeds  : function(raw){ return this.parse(/ +Otras velocidades +\(Mbps\): ([0-9 ]+)/, raw); },
  qualityToRSSI : function(quality){
    if (quality <= 0) {
      return 100;
    } else if (quality >= 100) {
      return -50;
    } else {
      return (quality / 2) - 100;
    }
  },
  getBSSIDS: function(raw){
    return raw.match(/BSSID[^]*?Otras velocidades \(Mbps\): [ 0-9]+/gm);
  },
  parseData: function(raw, callback){
    var self = this;
    var networks = [];
    for (var i = 0; i < raw.length; ++i) {
      var rawData     = raw[i];
      var ssid        = self.parseSSID(rawData);
      if (ssid){
        var auth        = self.parseAuth(rawData);
        var cyph        = self.parseCyph(rawData);
        var bssids      = self.getBSSIDS(rawData);
        if (bssids){
          for (var j = 0; j < bssids.length; j++){
            var bssid       = bssids[j];
            var network     = {};
            network.ssid    = (ssid === '') ? 'N/A' : ssid;
            network.auth    = auth;
            network.cyph    = cyph;
            network.bssid   = self.parseBSSID(bssid);
            network.quality = self.parseQuality(bssid);
            network.rssi    = (network.quality) ? self.qualityToRSSI(network.quality) : 0;
            network.radio   = self.parseRadio(bssid);
            network.channel = self.parseChannel(bssid);
            network.speeds  = self.parseSpeeds(bssid);
            network.oSpeeds = self.parseOSpeeds(bssid);
            networks.push(network);
          }
        }
      }
    };
    callback(null, networks);
  },
};

module.exports = Netsh;