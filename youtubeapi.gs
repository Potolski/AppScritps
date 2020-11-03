function refreshVideos() {
  var playlists = ['PLRAakQEiXFePow5GFamXk4a7me6XIS5Nq',
                   'PLRAakQEiXFeMVPXsZozMoU6RKvV4wz3EF'];
  
  SpreadsheetApp.getActiveSpreadsheet().deleteRows(2, SpreadsheetApp.getActiveSpreadsheet().getLastRow()-1);
  
  getVideosFromPlaylist(playlists);
}

function getVideosFromPlaylist(playlists){
  for(var index = 0; index < playlists.length; index++){
    var videoIds = getPlaylistVideoIds(playlists[index]);
    var videos = YouTube.Videos.list('id,snippet,statistics,contentDetails', { id: videoIds });
        
    for(var i = 0; i<videos.items.length; i++){
      var video = videos.items[i];
      var dataRow = [video.snippet.title,
                     video.statistics.viewCount,
                     video.statistics.likeCount,
                     video.statistics.commentCount,
                     video.contentDetails.duration,
                     video.snippet.publishedAt];
      
      SpreadsheetApp.getActiveSpreadsheet().appendRow(dataRow);
    }
    
    var lastRow = ['-','-','-','-','-','-'];
    SpreadsheetApp.getActiveSpreadsheet().appendRow(lastRow);
  }
}

function getPlaylistVideoIds(id){
  var playlistId = id;
  var videoIds = [];
  var nextPageToken = '';
  
   while (nextPageToken != null) {
      var playlistResponse = YouTube.PlaylistItems.list('snippet', {
        playlistId: playlistId,
        maxResults: 25,
        pageToken: nextPageToken
      });

      for (var i = 0; i < playlistResponse.items.length; i++) {
        var playlistItem = playlistResponse.items[i];
        videoIds.push(playlistItem.snippet.resourceId.videoId);
      }
      nextPageToken = playlistResponse.nextPageToken;
    }
  return videoIds;
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  ui.createMenu('YouTube Data')
  .addItem("Refresh", 'refreshVideos')
  .addToUi();
}