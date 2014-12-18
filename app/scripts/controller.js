		'use strict';

		/**
		 * @ngdoc function

		 * @name jukeApp.controller
		 */
		var jukeCtrl = angular.module('jukeApp.controllers', []);
		//base controller for the app


		jukeCtrl.controller('VideosController',['$scope', '$http', '$log', 'VideosService','$timeout','localStorageService', function($scope, $http, $log, VideosService,$timeout,localStorageService) {
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
		            	
				VideosService.launchPlayer(id, title);
				$scope.loadingBoot.loading = false;
		       	VideosService.archiveVideo(id, title);
		    };

		    $scope.queue = function(id, title) {
		    	$scope.loadingBoot.loading = true;
		    	var timeout=$timeout(function(){
		            	$scope.loadingBoot.loading = false;
		            	VideosService.queueVideo(id, title);
		        		VideosService.deleteVideo($scope.history, id);
		            	if($scope.upcoming.length==1){
		            		$scope.launch(id,title);
		            	}
		            	 
		        	},1000);
		    };

		    $scope.delete = function(list, id, state) {
		        $scope.loadingBoot.loading = true;
		        		if(list.length==1)
		        			$scope.youtube={};
		        		if($scope.youtube.videoId==id)
		        		{
		        				if($scope.upcoming[$scope.upcoming.length-1].id==id)
		        					$scope.playPrevious(id);
		        				else $scope.playNext(id);
		        			
		        		}
		        		var timeout=$timeout(function(){
		        			$scope.loadingBoot.loading = false;
		        			VideosService.deleteVideo(list, id, state);},1000);
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
		        VideosService.searchQuery($scope.query).then(function(resp){
		        	$scope.loadingBoot.loading = false;
		                VideosService.listResults(resp.data);
		        },function(){
		        	$scope.loadingBoot.loading = false
		            $log.info('Search error');
		        })
		    }

		    $scope.tabulate = function(state) {
		        $scope.playlist = state;
		    }

		}]);

		//contact controller
		jukeCtrl.controller('ContactController', ['$scope', function($scope){
			
		}]);
		//
		var modalInstanceController = function($scope, $modalInstance ) {
			$scope.redirectToCurrentPage=function(){
				$modalInstance.close();
			}
		}