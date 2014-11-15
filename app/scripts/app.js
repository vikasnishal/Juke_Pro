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
    'jukeApp.directives']);


  jukeApplication.run(function () {
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});



  jukeApplication.config( 
    function($routeProvider){
      $routeProvider
      .when('/jukeApp',{
        templateUrl:'views/home.html',
        controller:'VideosController'
      })
      .otherwise({
        redirectTo: '/jukeApp',
      });
    },function ($httpProvider) {
  // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

