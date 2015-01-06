var Netsh = require('./netsh');

//Netsh.wifiNetworkScan(function(err, networks){
//  if (err) return console.log(err);
//  console.log(networks);
//});

var raw1 = '\
SSID 1 : Conatel-WiFi\
    Tipo de red             : Infraestructura\
    Autenticación           : Abierta\
    Cifrado                 : WEP\
    BSSID 1             : 0c:68:03:1c:4a:c0\
         Señal              : 28%\
         Tipo de radio      : 802.11g\
         Canal              : 1\
  Velocidades básicas (Mbps): 1 2 5.5 11\
    Otras velocidades (Mbps): 6 9 12 18 24 36 48 54\
    BSSID 2             : 0c:85:25:32:8d:f0\
         Señal              : 74%\
         Tipo de radio      : 802.11g\
         Canal              : 6\
  Velocidades básicas (Mbps): 1 2 5.5 11\
    Otras velocidades (Mbps): 6 9 12 18 24 36 48 54\
'

var raw2 = '\
SSID 9 : dedicado_wifi\
    Tipo de red             : Infraestructura\
    Autenticación           : WPA2-Personal\
    Cifrado                 : CCMP\
    BSSID 1             : c0:4a:00:fb:0a:86\
         Señal              : 32%\
         Tipo de radio      : 802.11n\
         Canal              : 11\
  Velocidades básicas (Mbps): 1 2 5.5 11\
    Otras velocidades (Mbps): 6 9 12 18 24 36 48 54\
'
Netsh.wifiNetworkScan(function(err, networks, raw){
    if (err) console.log(err);
    console.log(networks);
});