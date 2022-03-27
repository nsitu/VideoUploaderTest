
let uploadToken = '';

// Ask NodeJS to fetch us a token for uploading
// https://api.video/blog/tutorials/delegated-uploads
axios.get('/uploadToken')
    .then( response =>{ 
       uploadToken = response.data;  
       document.querySelector("#input").style.display = 'block';
    })
    .catch(err=>{
        console.log(err);
    })


//TODO: create a video directly from a video hosted on a third-party serve
// https://docs.api.video/reference/create-a-video-documentation#add-an-url-to-upload-on-creation


function uploadFile(files) {
    
    // you might need to change this to use a progressive upload for large videos.
    // https://docs.api.video/docs/video-uploader
    let uploader = new VideoUploader({
        file: files[0],
        uploadToken: uploadToken
    })
    uploader.onProgress((event) => {
        percentComplete = parseInt(event.uploadedBytes / event.totalBytes * 100)
        document.querySelector("#progress").style.display ='block';
        document.querySelector("#progress #bar").style.width = percentComplete+'%';
    });
    uploader.upload()
        .then(video =>{
            document.querySelector("#progress").style.display ='none';
            statusReport(video) 
        })
        .catch(err=> console.log(err.status, err.message) ) 
}

async function statusReport(video){
    let data;
    let finished = false;
    await axios.get('/videoStatus/'+video.videoId).then(response=>{
        data = response.data;
        console.log(response.data)
    })
    let template = `<h2>${data.ingest.status}</h2>`;
    if (data.encoding.playable ){
        
        // https://docs.api.video/reference/create-a-video-documentation
        // HLS - Up to 6 responsive video streams will be created (from 240p to 4k)
        // Mp4 encoded versions are created at the highest quality (max 1080p) by default.
        // Hmm -- and what if I need a 4K mp4?
        // Can i extract  4K mp4 from an HLS stream?
        // Maybe I should use cloudinary instead. 
        // https://cloudinary.com/documentation/video_manipulation_and_delivery


        let encoded = data.encoding.qualities.filter((f) => f.status =='encoded')
        let qualities = data.encoding.qualities.map((f)=> f.quality.replace('p','') )
        // find the largest dimension (e.g. 1080)
        let maxQuality =  Math.max(...qualities);  
        for await (const format of data.encoding.qualities){
            template += `<p class="${format.status}">${format.type} ${format.quality}: ${format.status}</p>`
        } 
        if ( encoded.length == data.encoding.qualities.length) {
            console.log(`Encoding has been completed for all ${encoded.length} formats.`);
            finished = true;
        }
    }
    
    if (finished) {
        // when finished, create a cross section
        videoPlayer(video)
        crossSection(video, data)
        
    }
    else{
        // refresh the status every second until encoding is finished.
        setTimeout(statusReport, 1000, video)
    }
    document.querySelector('#statusReport').innerHTML = template;
}

function videoPlayer(video){
    console.log('creating video player');
    console.log(video);
    let template = `<h2>${video.title}</h2>
    <p>${video.videoId}</p>
    <video controls width="250">
        <source src="${video.assets.mp4}" type="video/mp4">
    </video> 
    `;
    document.querySelector('#videoPlayer').innerHTML = template;
}

async function crossSection(video, data){
    // TODO generate clips from video.
    // see the "clip" parameter here: https://docs.api.video/reference/post-video

    // discover the length of the video. 
    console.log(video)

    let duration = data.encoding.metadata.duration
    let framerate = data.encoding.metadata.framerate
    console.log(( duration * framerate) + ' Frames' )

    // TODO ask node to split the video into clips
    /*await axios.get('/createClip/'+video.videoId).then(response=>{
        data = response.data;
        console.log(response.data)
    })*/


}
