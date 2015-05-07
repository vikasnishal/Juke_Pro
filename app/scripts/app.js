'use strict';

/**
 * @ngdoc overview
 * @name jukeApp
 * @description
 * # jukeApp
 *
 * Main module of the application.
 */
var jukeApplication=angular
  .module('jukeApp', [
    'ngRoute','ui.bootstrap','jukeApp.controllers','jukeApp.servicesV3','jukeApp.filters',
    'jukeApp.directives','LocalStorageModule','firebase']);


  jukeApplication.run(function () {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});


  jukeApplication.constant('FIREBASE_URL', 'https://glaring-fire-3581.firebaseio.com');
  jukeApplication.config( ['$routeProvider','localStorageServiceProvider',
    function($routeProvider,localStorageServiceProvider){
      $routeProvider
      .when('/jukeApp',{
        templateUrl:'views/home.html',
        controller:'VideosController'
      });
      $routeProvider
      .when('/contact',{
        templateUrl:'views/contact.html',
        controller:'ContactController'
      });
      $routeProvider.otherwise({
        redirectTo: '/jukeApp',
      });
      localStorageServiceProvider
    .setPrefix('jukeApp')
    .setStorageType('localStorage')
    .setNotify(true, true)
    }]);

