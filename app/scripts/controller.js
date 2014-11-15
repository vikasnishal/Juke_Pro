	'use strict';

	/**
	 * @ngdoc function

	 * @name jukeApp.controller
	 */
	var jukeCtrl=angular.module('jukeApp.controllers',[]);
	//base controller for the app

	
jukeCtrl.controller('VideosController', function ($scope, $http, $log, VideosService) {
	$scope.loadingBoot={
		loading:false
	}
    init();

    function init() {
      $scope.youtube = VideosService.getYoutube();
      $scope.results = VideosService.getResults();
      $scope.upcoming = VideosService.getUpcoming();
      $scope.history = VideosService.getHistory();
      $scope.playlist = true;
    }

    $scope.launch = function (id, title) {
      VideosService.launchPlayer(id, title);
      VideosService.archiveVideo(id, title);
      // VideosService.deleteVideo($scope.upcoming, id);
      $log.info('Launched id:' + id + ' and title:' + title);
    };

    $scope.queue = function (id, title) {
      VideosService.queueVideo(id, title);
      VideosService.deleteVideo($scope.history, id);
      $log.info('Queued id:' + id + ' and title:' + title);
    };

    $scope.delete = function (list, id,state) {
      VideosService.deleteVideo(list, id,state);
    };

    $scope.search = function () {
    	$scope.loadingBoot.loading=true;
      $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyBMBhKQT8s8pJq9AkFbRfP66KvgktwgLBA',
          type: 'video',
          maxResults: '8',
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default',
          q: this.query
        }
      })
      .success( function (data) {
      	$scope.loadingBoot.loading=false;
        VideosService.listResults(data);
        $log.info(data);
      })
      .error( function () {
      	$scope.loadingBoot.loading=false
        $log.info('Search error');
      });
    }

    $scope.tabulate = function (state) {
      $scope.playlist = state;
    }
});