# Upload Test with api.video  
This is a NodeJS app to test out video uploads with [api.video](https://docs.api.video/reference/post_videos-videoid-source). It's a pretty nice tool for ingesting video, and it holds promise for making short clips from a longer video. It seems like there is also the possibility to ingest video via a third party URL (i.e. perhaps we could get it to ingest videos from Google Photos?)  
  
# API Key and Environment Variables. 
I have been using the "sandbox" (testing environment) on api.video for this demo. There is a "Sandbox API Key" that you can find in the [api.video dashboard](https://dashboard.api.video/overview). In this connection, our NodeJS app will look for an environment variable called AV_SANDBOX_KEY. Be sure to add this variable, or else you won't be able to use the API.  
  
# MP4 Limitations  
The encoding process with api.video produces both HLS and MP4. However It seems that MP4 encoding is limited to 1080p. "Up to 6 responsive video streams will be created (from 240p to 4k). Mp4 encoded versions are created at the highest quality (max 1080p) by default." See also: [https://docs.api.video/reference/create-a-video-documentation](https://docs.api.video/reference/create-a-video-documentation)  
