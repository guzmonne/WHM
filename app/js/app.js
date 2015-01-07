'use strict';

window.App = angular.module('whmApp', ['ui.router', 'chart.js']);

App.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url         : '/home',
      templateUrl : './templates/home/home.html'
    })
    .state('netsh', {
      url   : '/netsh',
      views : {
        '': {
          templateUrl : './templates/netsh/netsh.index.html',
          controller  : 'NetshIndexCtrl'
        },
        'viewA@netsh': {
          templateUrl : './templates/netsh/netsh.viewA.html',
          controller  : 'NetshViewACtrl'
        },
        'viewB@netsh': {
          templateUrl : './templates/netsh/netsh.viewB.html',
          controller  : 'NetshViewBCtrl'
        }
      }
    })
    .state('about', {
      url: '/about',
      views: {
        '': { templateUrl: './templates/about.html' },
        'columnOne@about': { template: 'Look I am a column' },
        'columnTwo@about': {
          templateUrl : './templates/table-data.html',
          controller  : 'ScotchCtrl'
        }
      }
    });
});