		'use strict';

		/**
		 * @ngdoc function

		 * @name jukeApp.controller
		 */
		var jukeCtrl = angular.module('jukeApp.controllers', []);
		//base controller for the app


		jukeCtrl.controller('VideosController', function($scope, $http, $log, VideosService,$timeout,localStorageService) {
		    $scope.loadingBoot = {
		        loading: false
		    }
		   init();
		    function init() {
		        $scope.youtube = VideosService.getYoutube();
		        $scope.results = VideosService.getResults();
		        $scope.upcoming = VideosService.getUpcoming();
		        $scope.history = VideosService.getHistory();
		        $scope.playlist = true;
		        $scope.shuffleon=VideosService.isShuffleOn();
		    }
		    
		    


		    $scope.launch = function(id, title) {
		    	$scope.loadingBoot.loading = true;
		    	var timeout=$timeout(function(){
		            	$scope.loadingBoot.loading = false;
						VideosService.launchPlayer(id, title);
		        		VideosService.archiveVideo(id, title);
		       	},1000);
		    };

		    $scope.queue = function(id, title) {
		    	$scope.loadingBoot.loading = true;
		    	var timeout=$timeout(function(){
		            	$scope.loadingBoot.loading = false;
		            	 VideosService.queueVideo(id, title);
		        		VideosService.deleteVideo($scope.history, id);
		        	},1000);
		    };

		    $scope.delete = function(list, id, state) {
		        $scope.loadingBoot.loading = true;
		    	var timeout=$timeout(function(){
		            	$scope.loadingBoot.loading = false;
		        		VideosService.deleteVideo(list, id, state);
		        	},1000);
		    };
		    // $scope.shuffleon = false;
		    $scope.changeShuffle = function() {
		        	VideosService.setShuffleOn();
		    };
		    $scope.changeRepeat=function(id,title){
		    	VideosService.setRepeatOn(id,title);
		    }
		    $scope.playPrevious = function(videoId) {
		    	$scope.loadingBoot.loading = true;
		    	var timeout=$timeout(function(){
		            	$scope.loadingBoot.loading = false;
		        if ($scope.shuffleon.shuffleOn == true) {
		        	var randomNum=VideosService.createRandomNumber(0,$scope.upcoming.length,videoId);

		            	VideosService.launchPlayer($scope.upcoming[randomNum].id, $scope.upcoming[randomNum].title);
		            
		        } 
		        else if ($scope.upcoming[0].id == videoId)
		            return;
		        else {
		            for (var video in $scope.upcoming) {
		                if ($scope.upcoming[video].id == videoId) {
		                	video--;
		                    VideosService.launchPlayer($scope.upcoming[video].id, $scope.upcoming[video].title);
		                    return;
		                }
		            }
		        }
		        },1000);
		        
		    };
		    
		    $scope.playNext = function(videoId) {
		    	$scope.loadingBoot.loading = true;
		    	var timeout=$timeout(function(){
		            	$scope.loadingBoot.loading = false;
		        
		        if ($scope.shuffleon.shuffleOn == true) {
		        	var randomNum=VideosService.createRandomNumber(0,$scope.upcoming.length,videoId);

		            	VideosService.launchPlayer($scope.upcoming[randomNum].id, $scope.upcoming[randomNum].title);
		            
		        }
		        else if ($scope.upcoming[$scope.upcoming.length - 1].id == videoId)
		            return; 
		        else {
		            for (var video in $scope.upcoming) {
		                if ($scope.upcoming[video].id == videoId) {
		                    video++;
		                    VideosService.launchPlayer($scope.upcoming[video].id, $scope.upcoming[video].title);
		                    return;
		                }
		            }
		        }
		        },1000);

		    };
		    $scope.search = function() {
		        $scope.loadingBoot.loading = true;
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
		            .success(function(data) {
		                $scope.loadingBoot.loading = false;
		                VideosService.listResults(data);
		                // $log.info(data);
		            })
		            .error(function() {
		                $scope.loadingBoot.loading = false
		                $log.info('Search error');
		            });
		    }

		    $scope.tabulate = function(state) {
		        $scope.playlist = state;
		    }
		});

		var modalInstanceController = function($scope, $modalInstance ) {
			$scope.redirectToCurrentPage=function(){
				$modalInstance.close();
			}
		}