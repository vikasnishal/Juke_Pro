var jukeService=angular.module('jukeApp.servicesV3',[]);

jukeService.service('VideosService', ['$window', '$rootScope', '$log','localStorageService', function ($window, $rootScope, $log,localStorageService) {

  var service = this;
  var storageType = localStorageService.getStorageType();
  var submit=function(key,value){
		    	return localStorageService.set(key, value);
		    };
   var getItem=function(key){
		    	return localStorageService.get(key);
		    };

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '480',
    playerWidth: '550',
    state: 'stopped',
    origin:"http://localhost:9000"
  };
  var results = [];
  var upcoming = [
    {id: 'kRJuY6ZDLPo', title: 'La Roux - In for the Kill (Twelves Remix)'},
  ];
  var history = [
    {id: 'XKa7Ywiv734', title: '[OFFICIAL HD] Daft Punk - Give Life Back To Music (feat. Nile Rodgers)'}
  ];
  var playControl={
  	shuffleOn:false,
  	repeatOn:false
  };
  this.isShuffleOn=function(){
  	return playControl;
  };
  this.setShuffleOn=function(){
  	if (playControl.shuffleOn == false && upcoming.length>1){
		           playControl.shuffleOn=true;
		       }

		        else
		            playControl.shuffleOn=false;
  };
  var playMediaQuery={
  	id:"",
  	title:""
  }
  this.setRepeatOn=function(id,title){
  	if (playControl.repeatOn == false ){
		           playControl.repeatOn=true;
		       }
		        else
		            playControl.repeatOn=false;
	playMediaQuery.id=id;
	playMediaQuery.title=title;	  
  }
  var createRandomNumber=function(start,end,id){
		    	var randomNum = (Math.floor(Math.random() * (end - 1) + start));
		    	if(upcoming[randomNum].id==id)
		    		createRandomNumber(start,end,id);
		    	return randomNum;
		    }
	this.createRandomNumber=function(start,end,id){
		return createRandomNumber(start,end,id);
	}
  $window.onYouTubeIframeAPIReady = function () {
    $log.info('Youtube API is ready');
    youtube.ready = true;
    service.bindPlayer('placeholder');
    service.loadPlayer();
    $rootScope.$apply();
  };

  function onYoutubeReady (event) {
    $log.info('YouTube Player is ready');
    youtube.player.loadVideoById(upcoming[0].id);
    // youtube.player.playVideoAt(randomNum);
    // youtube.player.setShuffle(shufflePlaylist:true);
    youtube.videoId = upcoming[0].id;
    youtube.videoTitle = upcoming[0].title;
  }

  function onYoutubeStateChange (event) {
    if (event.data == YT.PlayerState.PLAYING) {
      youtube.state = 'playing';
    } else if (event.data == YT.PlayerState.PAUSED) {
      youtube.state = 'paused';
    } else if (event.data == YT.PlayerState.ENDED) {
      youtube.state = 'ended';
      if(!playControl.repeatOn){
	      if(!playControl.shuffleOn){
	      		for (var video in upcoming) {
                    if (upcoming[video].id == youtube.videoId) {
                        video++;
                        service.launchPlayer(upcoming[video].id, upcoming[video].title);
                        return;
                    }
                }
	  		}
	  		else {
	  			var randomNum=createRandomNumber(0,upcoming.length,0);
	  			service.launchPlayer(upcoming[randomNum].id, upcoming[randomNum].title);
	      		service.archiveVideo(upcoming[randomNum].id, upcoming[randomNum].title);
	  		}
	  	}
	  	else{
	      		service.launchPlayer(youtube.videoId, youtube.videoTitle);	  		
	  	}
      // service.deleteVideo(upcoming, upcoming[0].id);
    }
    $rootScope.$apply();
  }

  this.bindPlayer = function (elementId) {
    $log.info('Binding to ' + elementId);
    youtube.playerId = elementId;
  };

  this.createPlayer = function () {
    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
    return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      events: {
        'onReady': onYoutubeReady,
        'onStateChange': onYoutubeStateChange
      }
    });
  };

  this.loadPlayer = function () {
    console.log("player is loaded");
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

  this.launchPlayer = function (id, title) {
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    return youtube;
  }

  this.listResults = function (data) {
    results.length = 0;
    for (var i = data.items.length - 1; i >= 0; i--) {
      results.push({
        id: data.items[i].id.videoId,
        title: data.items[i].snippet.title,
        description: data.items[i].snippet.description,
        thumbnail: data.items[i].snippet.thumbnails.default.url,
        author: data.items[i].snippet.channelTitle
      });
    }
    return results;
  }

  this.queueVideo = function (id, title) {
    upcoming.push({
      id: id,
      title: title
    });
 	submit('playlist',upcoming);
	console.log(getItem('playlist'));
	// $rootScope.$apply();
    return upcoming;
  };

  this.archiveVideo = function (id, title) {
    history.unshift({
      id: id,
      title: title
    });
    return history;
  };

  this.deleteVideo = function (list, id ,state) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].id === id) {
      	list.splice(i, 1)
      	if(state=='new')
      		submit('playlist',list);
      	else if(state=='old')
      		submit('historylist',list);
        	console.log(getItem('playlist'));
      }
    }
  };

  this.getYoutube = function () {
    return youtube;
  };

  this.getResults = function () {
    return results;
  };

  this.getUpcoming = function () {
		if(getItem('playlist')==null){
			submit('playlist',upcoming);
			return upcoming;
		}
		else{
			upcoming=getItem('playlist');
			return upcoming;
		};
  };

  this.getHistory = function () {
  	if(getItem('historylist')==null){
  			submit('historylist',history);
			return history;
		}
		else{
			history=getItem('historylist');
			return history;
		};
  };
		    
}]);