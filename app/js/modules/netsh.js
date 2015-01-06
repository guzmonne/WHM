'use strict';

var spawn = require('child_process').spawn;

var regexps = {
  auth: {
    en: / +Authentication + : (.+)/,
    es: / +Autenticaci�n + : (.+)/
  },
  cyph: {
    es: / +Cifrado + : (.+)/,
    en: / +Encryption + : (.+)/
  },
  signal: {
    es: / +Se�al +: ([0-9]+)%/,
    en: / +Signal +: ([0-9]+)%/
  },
  radio: {
    es: / +Tipo de radio +: ([0-9nabgc\.]+)/,
    en: / +Radio type +: ([0-9nabgc\.]+)/
  },
  channel: {
    es: / +Canal +: ([0-9]+)/,
    en: / +Channel +: ([0-9]+)/
  },
  speeds: {
    es: / +Velocidades b�sicas \(Mbps\): ([0-9 \.]+)/,
    en: / +Basic rates \(Mbps\) *: ([0-9 \.]+)/
  },
  oSpeeds: {
    es: / +Otras velocidades +\(Mbps\): ([0-9 ]+)/,
    en: / +Other rates +\(Mbps\) *: ([0-9 ]+)/
  },
  bssids: {
    es: /BSSID[^]*?Otras velocidades \(Mbps\): [ 0-9]+/gm,
    en: /BSSID[^]*?Other rates +\(Mbps\) *: [ 0-9]+/gm
  }
}

var Netsh = {
  lang: 'es',
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
      var raw;
      if (code !== 0) return callback(new Error(code));
      raw = res.split('\r\n\r\n');
      self.lang = (raw.slice(0, 1)[0].match(/ \r\nInterface name/)) ? 'en' : 'es';
      self.parseData(raw, callback);
    });
  },
  max: function(array){ return Math.max.apply(null, array); },
  parse: function(regexp, raw){
    var result = '', match = raw.match( (new RegExp(regexp)) );
    if (match && match.length == 2) result = match[1];
    return result;
  },
  parseSSID     : function(raw){ return this.parse(/^SSID [0-9]+ : (.+)/, raw); },
  parseAuth     : function(raw){ return this.parse(regexps.auth[this.lang], raw); },
  parseCyph     : function(raw){ return this.parse(regexps.cyph[this.lang], raw); },
  parseBSSID    : function(raw){ return this.parse(/^BSSID [0-9]+ +: (.+)/, raw); },
  parseQuality  : function(raw){ return this.parse(regexps.signal[this.lang], raw); },
  parseRadio    : function(raw){ return this.parse(regexps.radio[this.lang], raw); },
  parseChannel  : function(raw){ return this.parse(regexps.channel[this.lang], raw); },
  parseSpeeds   : function(raw){ return this.parse(regexps.speeds[this.lang], raw); },
  parseOSpeeds  : function(raw){ return this.parse(regexps.oSpeeds[this.lang], raw); },
  qualityToRSSI : function(quality){
    if (quality <= 0) {
      return -100;
    } else if (quality >= 100) {
      return -30;
    } else {
      return parseInt((quality * 6 / 10) - 90);
      //return (quality / 2) - 100;
    }
  },
  parseBSSIDs: function(raw){ return raw.match(regexps.bssids[this.lang]); },
  parseData: function(raw, callback){
    var self = this;
    var networks = [];
    for (var i = 0; i < raw.length; ++i) {
      var rawData     = raw[i];
      var ssid        = self.parseSSID(rawData);
      if (ssid){
        var auth        = self.parseAuth(rawData);
        var cyph        = self.parseCyph(rawData);
        var bssids      = self.parseBSSIDs(rawData);
        //console.log(ssid + ' ' + auth + ' ' + cyph);
        //console.log(bssids);
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